public with sharing class DisplayCSVController {
    
    @AuraEnabled
    public static DataTableResponse getCSVFileId(Id recordId){
        
        try {
            
            List<DataTableColumns> lstDataColumns = new List<DataTableColumns>();
            List<String> lstDataTableData = new List<String>();
            
            String lstData; 
            
            String fileId=getContentDocumentLink(recordId);
            System.debug('fileId'+fileId );
           
            
            if(string.isNotBlank(fileId)){
                 List<ContentVersion> contentVersionRec=getContentVerson(fileId);
                
                List <String> records = contentVersionRec[0].VersionData.toString().split('\n');
                string headers = records[0];
               
                for(integer i=1;i<records.size();i++){
                    lstData = records[i];
                    lstDataTableData.add(lstData);
                  
                }
                System.debug('@@@@@@@@@@@@@@@@@@@@@@@@@'); 
                
                List<String> lstHeader = headers.split(',');
               
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
                
            }
            DataTableResponse finalWrapper   = new DataTableResponse();
            finalWrapper.lstDataTableColumns = lstDataColumns;
            finalWrapper.lstDataTableData    = lstDataTableData;
            System.debug('finalWrapper'+finalWrapper); 
            System.debug('finalWrapper>>>columns'+finalWrapper.lstDataTableColumns); 
            
            return finalWrapper;
            
            
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
            
            String fileId=getContentDocumentLink(recordId);
            
            List<ContentVersion> contentVersionRec=getContentVerson(fileId);
            
            List <String> records = contentVersionRec[0].VersionData.toString().split('\n');
            System.debug(' records>>>>>>>'+records);
            String csvRows = records.remove(0);//Removing headers
            
           
            String getVal;
            for(String rec:records){
               
                List<String> splittedValue=rec.split(',');
                System.debug(' splittedValue>>>>>>>'+splittedValue);
                Opportunity opp = new Opportunity();   
                if(splittedValue[3].contains('\r')){
                    System.debug(' in if');
                    opp.Amount=Decimal.ValueOf(splittedValue[3].replace('\r',''));
                    System.debug(' Amount'+  opp.Amount);
                   
                }
                
                opp.Name=splittedValue[0];
                opp.StageName=splittedValue[1];
                
                opp.CloseDate=date.parse(splittedValue[2]);
                
                //  opp.Amount=Decimal.ValueOf(splittedValue[3]);
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
    
    public static String getContentDocumentLink(Id recordId){
       
        String fileId;
        List<ContentDocumentLink> contentDocumentLinks = [
            SELECT LinkedEntityId,ContentDocumentId  FROM ContentDocumentLink where LinkedEntityId =:recordId  AND ContentDocument.FileType='CSV' Limit 1
        ];
        if(contentDocumentLinks.size()>0){
            for(ContentDocumentLink con:contentDocumentLinks){
                fileId=con.ContentDocumentId;
            }
            
            return fileId;
        }else{
            return '';
        }
    }
    
     public static List<ContentVersion>  getContentVerson(Id fileId){
       
           List<ContentVersion> listContentVersions = [SELECT VersionData 
                                                        FROM ContentVersion 
                                                        WHERE ContentDocumentId =: fileId
                                                        AND
                                                        IsLatest = true
                                                        LIMIT 1
                                                       ];
            
       
            return listContentVersions;
        
    }
    
   
}