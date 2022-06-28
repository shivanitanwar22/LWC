public with sharing class dynamicqueryController {
    @AuraEnabled
    public static List<Account> acct(String q) {
         List<Account> obj = Database.query(q);
         return obj;

    }
}
