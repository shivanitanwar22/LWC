public with sharing class WhatsappController {
  
    @AuraEnabled
    public static Boolean  sendTemplateMessage(String contactId){
        try {
           Contact contactDetail=[SELECT Id,Phone from Contact where Id=:contactId];
           String whatsAppNumber='91'+ contactDetail.Phone;
           System.debug('whatsappNumber>>>'+whatsAppNumber);

           Http http = new Http();
           HttpRequest req= new HttpRequest();
           req.setEndpoint('https://graph.facebook.com/v13.0/105359268879345/messages');
           req.setHeader('Content-type','application/json');
           req.setMethod('POST');

           String body= '{ "messaging_product": "whatsapp", "to": " '+ whatsAppNumber + '", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }';
           req.setBody(body);
           String apiToken= 'EAAFjeNLAkhoBAMK76OEnkje9BywS5tIOawygABH8FTEhZCdrhcS7xS2549oLs023HbBWt3P2b7kJ4N0IA5sTwPjXe87IguO15QBpsi4tbW1QFVbk3ZCNsaTsf5uropeZC7p49oSATZA87kFw3GrKBKIo8FYac8J7YhDgkdpcJopPokhGPPAn6XlJPxuFSaTkU4YNsb9C2AZDZD'; 
           req.setHeader('Authorization','Bearer '+apiToken);

           HttpResponse res= http.send(req);
           system.debug('response>>>>>>>>>>>>>>>>>>>>>>.'+res);

           if(res.getStatusCode()==200){
               return true;
           }else{
               return false;
           }

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}