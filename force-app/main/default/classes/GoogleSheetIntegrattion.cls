public with sharing class GoogleSheetIntegrattion {
    @AuraEnabled
    public static String googleSheetIntegrattionHandler(String contactId) {

       /* Contact conRec= [SELECT Id, FirstName,LastName,GoogleSync__c from Contact where ID=:contactId];
       
        String returnBody;
    
        Http http = new Http();
        HttpRequest  req = new HttpRequest();
        req.setEndpoint('callout:GoogleSheetsAPI/v4/spreadsheets/1oX6FJ0blr5XrSTssiSJT2NkzSOCh7t4pdv_XBxv9uRY/values/Sheet1?valueInputOption=RAW');
        req.setHeader('Content-Type','application/json');
        req.setHeader('Accept','application/json');

       
    
        req.setMethod('PUT');
       // req.setBody('Body');
        String jsonString = '{' + 
              '"majorDimension": "ROWS", ' +
              '"values":['+
              '["'+conRec.FirstName+'","'+conRec.LastName+'"]'+
              '  ],'+
              '"range": "Sheet1"'+
             
              '}';
        req.setBody(jsonString);    
        HttpResponse res= http.send(req);   
        System.debug('JSON Resp Body'+res.getBody());
        if(res.getStatusCode()==200){
            conRec.GoogleSync__c=true;
            update conRec;
            returnBody='Successfully Sync';

        }else{
            System.debug('Sync Failed');
            returnBody='Sync Failed';
        }     

    return returnBody;*/


        
       Contact conRec= [SELECT Id, FirstName,LastName,GoogleSync__c from Contact where ID=:contactId];
        String returnBody;
        if(conRec.GoogleSync__c==false){
        Http http = new Http();
        HttpRequest  req = new HttpRequest();
        req.setEndpoint('callout:GoogleSheetsAPI/v4/spreadsheets/1oX6FJ0blr5XrSTssiSJT2NkzSOCh7t4pdv_XBxv9uRY/values/Sheet1:append?valueInputOption=RAW');
        req.setHeader('Content-Type','application/json');
        req.setHeader('Accept','application/json');
     //   req.setHeader('Content-Length', '512');
        req.setMethod('POST');
       // req.setBody('Body');
        String jsonString = '{' + 
              '"majorDimension": "ROWS", ' +
              '"values":['+
              '["'+conRec.FirstName+'","'+conRec.LastName+'"]'+
              '  ],'+
              '"range": "Sheet1"'+
             
              '}';
        req.setBody(jsonString);    
        HttpResponse res= http.send(req);   
        System.debug('JSON Resp Body'+res.getBody());
        if(res.getStatusCode()==200){
            conRec.GoogleSync__c=true;
            update conRec;
            returnBody='Successfully Sync';

        }else{
            System.debug('Sync Failed');
            returnBody='Sync Failed';
        }     

    }return returnBody;
}
}