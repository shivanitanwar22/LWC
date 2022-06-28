public with sharing class DisplayCSVController {
     
    @AuraEnabled
    
    public static DataTableResponse getCSVFileId(Id recordId){
      
        try {
            
           List<DataTableColumns> lstDataColumns = new List<DataTableColumns>();
            List<String> lstDataTableData = new List<String>();
         
            String lstData;       
            List<ContentDocumentLink> contentDocumentLinks = [
                SELECT LinkedEntityId,ContentDocumentId  FROM ContentDocumentLink where LinkedEntityId =:recordId  AND ContentDocument.FileType='CSV' Limit 1
            ];
            
            List<ContentVersion> listContentVersions = [SELECT VersionData 
                                                        FROM ContentVersion 
                                                        WHERE ContentDocumentId =: contentDocumentLinks[0].ContentDocumentId
                                                        AND
                                                        IsLatest = true
                                                        LIMIT 1
                                                       ];
            
            
            List <String> records = listContentVersions[0].VersionData.toString().split('\n');
            string headers = records[0];
            System.debug(' hEAder>>>>>>>'+headers); 
            System.debug(' records.size()>>>>>>>'+records.size());
            
           for(integer i=1;i<records.size();i++){
                lstData = records[i];
                lstDataTableData.add(lstData);
                  System.debug(' lstData>>>>>>>'+lstData);   
            }
           System.debug('@@@@@@@@@@@@@@@@@@@@@@@@@'); 
            
            List<String> lstHeader = headers.split(',');
            System.debug(' hEAder>>>>>>>'+lstHeader); 
            System.debug(' lstHeader>>>>>>>'+lstHeader.size()); 
            for(integer i = 0; i <lstHeader.size(); i++)
            {
                  System.debug(' trim>>>>>>>'+lstHeader[i].trim());
               DataTableColumns datacolumns = new DataTableColumns(lstHeader[i].trim() , 
                                                                    lstHeader[i].trim(),
                                                                    lstHeader[i].substringAfter(',').trim()
                                                                   );
                
                lstDataColumns.add(datacolumns);
            }
             System.debug(' lstDataColumns>>>>>>>'+lstDataColumns); 
            
            
            DataTableResponse finalWrapper   = new DataTableResponse();
            finalWrapper.lstDataTableColumns = lstDataColumns;
            finalWrapper.lstDataTableData    = lstDataTableData;
               System.debug('finalWrapper'+finalWrapper); 
             System.debug('finalWrapper>>>columns'+finalWrapper.lstDataTableColumns); 
            
            return finalWrapper;
            
            
            
            
            //  String stringData = EncodingUtil.base64Decode(EncodingUtil.base64Encode(listContentVersions[0].VersionData)).toString();               
            // System.debug('stringData>>>>>>>'+stringData);
            
            
        }
        catch (Exception ex) {
            
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
    
    
    
    
    
    public class DataTableColumns {
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled       
        public String fieldName {get;set;}
        @AuraEnabled
        public String type {get;set;}
        
        public DataTableColumns(String label, String fieldName, String type)
        {
            this.label     = label;
            this.fieldName = fieldName;
            this.type      = type;          
        }
    }
    
    public class DataTableResponse {
        @AuraEnabled
        public List<DataTableColumns> lstDataTableColumns {get;set;}
        @AuraEnabled
        public List<String> lstDataTableData {get;set;}
        
    }

    @AuraEnabled
    public static String createOpportunities(Id recordId){
        try {
          List<DataTableColumns> lstDataColumns = new List<DataTableColumns>();
            List<String> lstDataTableData = new List<String>();
            List<Opportunity> oppList = new List<Opportunity>();
               String strMessage;
            String lstData;       
            List<ContentDocumentLink> contentDocumentLinks = [
                SELECT LinkedEntityId,ContentDocumentId  FROM ContentDocumentLink where LinkedEntityId =:recordId  AND ContentDocument.FileType='CSV' Limit 1
            ];
            
            List<ContentVersion> listContentVersions = [SELECT VersionData 
                                                        FROM ContentVersion 
                                                        WHERE ContentDocumentId =: contentDocumentLinks[0].ContentDocumentId
                                                        AND
                                                        IsLatest = true
                                                        LIMIT 1
                                                       ];
            
            
            List <String> records = listContentVersions[0].VersionData.toString().split('\n');
            System.debug(' records>>>>>>>'+records);
            String csvRows = records.remove(0);//Removing headers
            
            System.debug(' removed headers name>>>>>>>'+csvRows);
            for(String rec:records){
                System.debug(' rec>>>>>>>'+rec);
                List<String> splittedValue=rec.split(',');
                   
                Opportunity opp = new Opportunity();
                opp.Name=splittedValue[0];
                opp.StageName=splittedValue[1];
               
                opp.CloseDate=date.parse(splittedValue[2]);
                
                opp.Amount=Decimal.ValueOf(splittedValue[3]);
                oppList.add(opp);                
            }
            if(oppList.size()>0){
                List<Database.SaveResult> recordsToInsert= Database.insert(oppList,false);
                
                for(Database.SaveResult sr:recordsToInsert){
                    if(sr.isSuccess()){
                         strMessage = 'Records loaded successfully';
                        System.debug('Success');
                    }else{
                         strMessage = 'Some error occured. Please reach out to your System Admin';
                          System.debug('Fail');
                    }
                }
               
                
            }
             return strMessage;
            
          
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}