package com.almos.chatRoom;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String content;
    private String sender;
    private String receiver;
    private MessageType type;

    //For some reason lombok annotations don't work...
    //So I had to write getters manually, so it won't throw "MessageConversionException"
    public String getContent() {
        return content;
    }
    public String getSender() { return sender; }
    public String getReceiver() {
        return receiver;
    }
    public MessageType getType() {
        return type;
    }
}
