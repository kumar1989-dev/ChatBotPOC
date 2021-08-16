import { track, wire } from 'lwc';

import BaseChatMessage from 'lightningsnapin/baseChatMessage'
import chatRefInfo from '@salesforce/apex/GS_ChatBotReferenceController.getChatRefDetails';
/**
 * Displays a chat message using the inherited api messageContent and is styled based on the inherited api userType and messageContent api objects passed in from BaseChatMessage.
 */

 const CHAT_CONTENT_CLASS = 'chat-content';
 const AGENT_USER_TYPE = 'agent';
 const CHASITOR_USER_TYPE = 'chasitor';
 const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];

export default class GSChatBotMessageComponent extends BaseChatMessage {
    @track messageStyle = '';
    @track caseStatusCheck = '';
    @track ii = 1;
    @track showSpinner = false;
    @track chatRefDet = {};
    @track msgValue = '';
    @track chatReferenceId = '';
    isSupportedUserType(userType) {
        return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
    }

    connectedCallback() {
        console.log(this.userType+'Bharat'+JSON.stringify(this.messageContent));
        let msgBody = this.messageContent;
        
        this.msgValue = msgBody.value;
        if (this.isSupportedUserType(this.userType)) {
            this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;
        }
        if(this.msgValue.startsWith("lwc:")){
            
            let afterSplit = [];
            afterSplit = this.msgValue.split(':');
            console.log('Split the message'+afterSplit);
            if(afterSplit[2] == 'CaseCreation'){                
                if(afterSplit.length == 4){
                    this.chatReferenceId = afterSplit[3];
                } 
                this.test1();              
            }
            this.msgValue = 'Please hold on until we process the request.';
        }
        /*if(msgBody != 'undefined' || msgBody != ''){
        
            let msgType = msgBody.type;
            if(this.msgValue == 'What is your serial number?'){                
                this.jaffa();
            }
            else if(this.caseStatusCheck && this.showSpinner && this.msgValue != ''){
                this.msgValue = 'Please hand on until we process the request.';
                this.jaffa();
            }
        }*/
    }
    
    renderedCallback() {
        //do something
        
        if(this.caseStatusCheck.includes('Hello world')){
            console.log('Inside renderer');
            this.showSpinner = true;
            setTimeout(() => { 
                this.test1();
             }, 5000);
        }
    }

    test1(){
        chatRefInfo({chatRefId : this.chatReferenceId})
        .then(result => {
            console.log('Result'+JSON.stringify(result));
            if(result.Status__c == 'Success'){
                this.showSpinner = false;
                this.ii = 0;
                this.caseStatusCheck = '';
                this.msgValue = result.Error_Message__c;
            }
            else{
                console.log('I am jaff');
                this.ii += 1;
                this.caseStatusCheck = 'Hello world'+this.ii;
            }
            this.chatRefDet = result;
        })
        .catch(error => {
            console.log('Errorured:- '+error.body.message);
        });

        
    }
    get isAgent() {
        return this.userType === 'agent';
    }
    
}