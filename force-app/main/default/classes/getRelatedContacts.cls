public  class getRelatedContacts {
    @AuraEnabled(Cacheable=true)
    
    public static List<Contact> getAccountsId(Id acctId){
        
        List<Contact> clist= [SELECT Id,AccountId,Principal__c,Time__c,Simple_Interest__c,Rate__c,LastName,Email from Contact WHERE AccountId =:acctId ];
        System.debug('inside List');
    
        return clist;
    }
    @AuraEnabled
     public static void createContacts(List<Contact> contList,Id recordId){

List<Contact> con = new List<Contact>();
upsert contList;
for(Contact a:contList){
a.AccountId = recordId;
System.debug('my accountId'+  a.AccountId );
con.add(a);
}
update con;
System.debug('updtaed'+ con);
}
 
    
}