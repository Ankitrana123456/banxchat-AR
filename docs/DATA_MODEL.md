# Ban X Chat — Firestore Data Model

## users/{uid}
- name
- email
- photo
- online (bool)
- musicUrl
- role: "admin" | "user"
- blocked: [uid]

## convos/{convoId}
- bgUrl?
- lastMsg
- lastMsgTime
- members: [uid, uid]
## convos/{convoId}/msgs/{msgId}
- from, to, text, type, fileUrl?, reactions: { uid: emoji }, forwardFrom?, ts, seen

## groups/{groupId}
- name, photo, adminUid, members: [uid], createdAt
## groups/{groupId}/msgs/{msgId}
- same as convos messages

## channels/official
- members/{uid} (doc contains joinedAt)
- msgs/{msgId}: fromAdmin:true, text, ts
