rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth!=null;
      allow write: if request.auth!=null && request.auth.uid==userId;
    }

    match /convos/{cid} {
      allow read, write: if request.auth!=null;
      match /msgs/{mid} {
        allow read, write: if request.auth!=null;
      }
    }

    match /groups/{gid} {
      allow read, write: if request.auth!=null;
      match /msgs/{mid} { allow read, write: if request.auth!=null; }
    }

    match /channels/{cid} {
      allow read: if request.auth!=null;
      allow write: if request.auth!=null && request.auth.token.role=="admin";
      match /msgs/{mid} {
        allow read: if request.auth!=null;
        allow write: if request.auth!=null && request.auth.token.role=="admin";
      }
    }
  }
        }
