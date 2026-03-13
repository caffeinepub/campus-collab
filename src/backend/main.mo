import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type Definitions
  type UserProfile = {
    name : Text;
    major : Text;
    skills : [Text];
    available : Bool;
    portfolioUrl : ?Text;
  };

  type Project = {
    id : Nat;
    owner : Principal;
    title : Text;
    description : Text;
    skillsOffered : [Text];
    skillsNeeded : [Text];
    figmaUrl : ?Text;
    githubUrl : ?Text;
    timestamp : Time.Time;
  };

  type Message = {
    from : Principal;
    to : Principal;
    body : Text;
    projectId : ?Nat;
    timestamp : Time.Time;
    read : Bool;
  };

  type ConversationPreview = {
    otherParty : Principal;
    lastMessage : Text;
    timestamp : Time.Time;
    unreadCount : Nat;
  };

  module TupleKey {
    public func compare(tupleA : (Principal, Principal), tupleB : (Principal, Principal)) : Order.Order {
      let pA = tupleA.0.toText();
      let pB = tupleA.1.toText();
      let pC = tupleB.0.toText();
      let pD = tupleB.1.toText();

      switch (Text.compare(pA, pC)) {
        case (#equal) { Text.compare(pB, pD) };
        case (order) { order };
      };
    };
  };

  // Internal State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let profiles = Map.empty<Principal, UserProfile>();
  let projects = Map.empty<Nat, Project>();
  var nextProjectId = 1;

  let conversations = Map.empty<(Principal, Principal), List.List<Message>>();
  // User Profile Functions
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view all profiles");
    };
    profiles.values().toArray().sort(sortUserProfiles);
  };

  func sortUserProfiles(a : UserProfile, b : UserProfile) : Order.Order {
    Text.compare(a.name, b.name);
  };

  // Project Functions
  public shared ({ caller }) func createProject(title : Text, description : Text, skillsOffered : [Text], skillsNeeded : [Text], figmaUrl : ?Text, githubUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    let projectId = nextProjectId;
    let project : Project = {
      id = projectId;
      owner = caller;
      title;
      description;
      skillsOffered;
      skillsNeeded;
      figmaUrl;
      githubUrl;
      timestamp = Time.now();
    };

    projects.add(projectId, project);
    nextProjectId += 1;
    projectId;
  };

  public query ({ caller }) func getProject(projectId : Nat) : async ?Project {
    // Anyone can view projects (including guests)
    projects.get(projectId);
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    // Anyone can list all projects (including guests)
    projects.values().toArray().sort(sortProjects);
  };

  public query ({ caller }) func getProjectsBySkill(skill : Text) : async [Project] {
    // Anyone can filter projects by skill (including guests)
    let filtered = projects.values().filter(
      func(p) {
        p.skillsNeeded.values().any(func(s) { Text.equal(s, skill) });
      }
    );
    filtered.toArray();
  };

  func sortProjects(a : Project, b : Project) : Order.Order {
    Text.compare(a.title, b.title);
  };

  // Messaging Functions
  public shared ({ caller }) func sendMessage(
    to : Principal,
    body : Text,
    projectId : ?Nat,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let message : Message = {
      from = caller;
      to;
      body;
      projectId;
      timestamp = Time.now();
      read = false;
    };

    let convoKey = if (caller.toText() < to.toText()) { (caller, to) } else { (to, caller) };

    let convoList = switch (conversations.get(convoKey)) {
      case (null) { List.empty<Message>() };
      case (?existing) { existing };
    };

    convoList.add(message);
    conversations.add(convoKey, convoList);
  };

  public query ({ caller }) func getConversationPreview() : async [ConversationPreview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };
    let previews = List.empty<ConversationPreview>();
    for ((convoKey, convoMessages) in conversations.entries()) {
      let (p1, p2) = convoKey;
      if (p1 == caller or p2 == caller) {
        let otherParty = if (p1 == caller) { p2 } else { p1 };
        switch (convoMessages.last()) {
          case (null) {};
          case (?lastMsg) {
            let unread = convoMessages.values().filter(
              func(m) { m.to == caller and not m.read }
            ).size();
            previews.add({
              otherParty;
              lastMessage = lastMsg.body;
              timestamp = lastMsg.timestamp;
              unreadCount = unread;
            });
          };
        };
      };
    };
    previews.reverse().toArray();
  };

  public query ({ caller }) func getMessageThread(otherParty : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view message threads");
    };
    let convoKey = if (caller.toText() < otherParty.toText()) { (caller, otherParty) } else {
      (otherParty, caller);
    };
    switch (conversations.get(convoKey)) {
      case (null) { [] };
      case (?msgs) { msgs.reverse().toArray() };
    };
  };

  public shared ({ caller }) func markThreadRead(otherParty : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark messages as read");
    };
    let convoKey = if (caller.toText() < otherParty.toText()) { (caller, otherParty) } else {
      (otherParty, caller);
    };
    switch (conversations.get(convoKey)) {
      case (null) {};
      case (?msgs) {
        let updatedMsgs = List.empty<Message>();
        for (msg in msgs.values()) {
          if (msg.to == caller and not msg.read) {
            updatedMsgs.add({
              from = msg.from;
              to = msg.to;
              body = msg.body;
              projectId = msg.projectId;
              timestamp = msg.timestamp;
              read = true;
            });
          } else {
            updatedMsgs.add(msg);
          };
        };
        conversations.add(convoKey, updatedMsgs);
      };
    };
  };

  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unread message count");
    };
    var count = 0;
    for ((_, msgs) in conversations.entries()) {
      for (msg in msgs.values()) {
        if (msg.to == caller and not msg.read) {
          count += 1;
        };
      };
    };
    count;
  };
};
