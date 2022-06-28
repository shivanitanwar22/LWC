public with sharing class SimpleInterestContact {
    @AuraEnabled
    public static List<Contact> getContacts(Id recId){
        return [SELECT Id, Name,FirstName, LastName, Email, Principal__c, Rate__c, Time__c, Simple_Interest__c FROM Contact WHERE AccountId =: recId];
    }

    @AuraEnabled
    public static void createContacts(List<Contact> updateRecord,Id recordId){
       System.debug('Submit contact' + updateRecord);
       List<Contact> con = new List<Contact>();
        upsert updateRecord;   
        for(Contact a:updateRecord){
            a.AccountId = recordId;
            System.debug('my accountId'+  a.AccountId );
            con.add(a);
            }
            update con;
            System.debug('updtaed'+ con);

}
}
