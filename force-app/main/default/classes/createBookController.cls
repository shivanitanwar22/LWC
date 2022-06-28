public  class createBookController {
    @AuraEnabled(Cacheable=true)      
            public static List<Book__c> getISBN(Integer isbnNo){
                List<Book__c> blist=[SELECT Name,ISBN_Number__c,Author__c,Price__c from Book__c WHERE ISBN_Number__c =:isbnNo];
                System.debug('inside List');
            
                return blist;
            }
    }
    
