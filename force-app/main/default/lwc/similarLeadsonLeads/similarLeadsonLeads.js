import { LightningElement,track,wire,api } from 'lwc';
//import   findDuplicates from '@salesforce/apex/duplicateRecordsFinder.findDuplicates';
import similarLeadsonLeads from '@salesforce/apex/duplicateRecordsFinder.similarLeadsonLeads';
import { NavigationMixin } from 'lightning/navigation';
import getCustomSettings from '@salesforce/apex/duplicateRecordsFinder.getCustomSettings';
import getField from '@salesforce/apex/duplicateRecordsFinder.getAllColumnsDetail';
import  displayUpdatedDatatable from '@salesforce/apex/duplicateRecordsFinder.displayUpdatedDatatable';
export default class SimilarLeadsonLeads extends NavigationMixin (LightningElement) {
  
    @track iscolumnWindow = false;
    @track customDT=true;
    @track minField;
    @track maxField;
    @track allFields = [];
    @track allSelectedField = [];
    @api objectData = [];
    @track columnArrays = [];
    @track fieldsForCloumn = [];
    @api objectApiName;
    requiredOptions = [];
    @track all=[];

    loaded = false;
    @track fixeddata=[];
    //@track recordId='00Q1y000001przHEAQ';
    @api recordId;
   
    @track message;
    @track Name;
    @track error;
    @track Email;
    @track Id;
    @track Company;
    @track LeadOwner;
    @track showTable=true;
    @track getBlockDomainRes='';
    @track stringWithoutComma;
    @track recEmail;
    @track selectedIdsArray = [];
    @api 
    get fieldsForCloumns(){
        return this.fieldsForCloumn;
    }
    set fieldsForCloumns(val){
    }


    connectedCallback(){

        getCustomSettings().then(result=>{
            console.log('leadId>>>>>',this.recordId);
            console.log('object Name+++++++>>',this.objectApiName);
             this.message=result;
            console.log('inside get custom cs result>>>>>',JSON.stringify(result));
             // this.getBlockDomainRes=result;
              if(result.length>0){
                for(let x in result){
                   
                    this.getBlockDomainRes+=result[x].Name + ',' ;
                    this.stringWithoutComma =   this.getBlockDomainRes.replace(/,*$/, "")
                    console.log('comma seprated list is----> '+ this.stringWithoutComma);
                }
             }
         
          
          }).catch(error=>{
               
        })
        
        similarLeadsonLeads({leadId:this.recordId,objectName : this.objectApiName}).then(result=>{
                console.log('leadId>>',this.recordId);
                console.log('object Name>>', this.objectApiName);
                 this.message=result;
                 console.log('message',this.message);
                 if(this.message.length === 0){
                    this.loaded = !this.loaded;
                    this.showTable= false;
                    this.customDT= false;
                     }  else{
                        this.loaded = !this.loaded;
                        this.showTable= true;
                        
                    }
                    this.message.forEach((row) =>{
                        let dataline = {};
                       dataline.Id = row.Id;
                       dataline.Name = row.Name;
                       dataline.Email= row.Email;
                       dataline.LeadOwner = row.OwnerId;
                       dataline.Company = row.Company;
                      
                       console.log('Lead Id'+dataline.Id);
                      console.log('Lead name'+dataline.Name);
                      console.log('Email'+dataline.Email);
                     
                
                      
                       this.fixeddata.push(dataline);
                       console.log(this.fixeddata);
                   })
                 console.log('result>>>>>',JSON.stringify(result));
                // console.log('track columntable',this.columnTable);
              
             }).catch(error=>{
                 this.error='Error';
             })
          
          }
   

    @wire(getField, {objectApiName : '$objectApiName'}) setObjectField({error, data}){
       
        if(data){
            console.log('*******objectApiname>>>>',this.objectApiName);
            console.log('data>>>>',data);
            const fields = [];
            for(let key in data){
                fields.push({
                    label : data[key],
                    value :key
                })
            }
            this.allFields = fields;
           // this.allFields+=
        }else if(error){
            console.log(error);
        }
    };

    updateSelectedColumns(event){
        const valueSelected = event.target.value;
        this.allSelectedField = valueSelected;
       // allSelectedField+=this.allSelectedField.push('Company');
      // this.allSelectedField.push(...['Company']);
        console.log('selected values>>>',  valueSelected);
    }

    showColumnSelectionWindow(event){
        this.iscolumnWindow = true;
        this.requiredOptions.push(...['Email']);
       // this.requiredOptions.push(...['Email']);
        console.log('required opt>>>>>>>', this.requiredOptions);
        console.log('Email val>>>>>');
       
    }

    closeModel(event){
        const eventName = event.target.name;
 
        if(eventName === 'saveAction'){
            const selectedFields = this.allSelectedField;
            this.customDT=false;
            console.log('save act>>>customDT', this.customDT);
            const addfields = [];
           
            const fieldAPI = [];
            for(let i = 0; i < selectedFields.length; i++){
                for(let key in this.allFields){
                    if(this.allFields[key].value === selectedFields[i]){
                        addfields.push({
                            label : this.allFields[key].label,
                            fieldName : this.allFields[key].value
                        });
                        fieldAPI.push(this.allFields[key].value);
                        
                      //  console.log('company>>',fieldAPI);
                    }
                }
            }
            this.fieldsForCloumn = addfields;
            this.columnArrays = fieldAPI;
            displayUpdatedDatatable({selectedField : JSON.stringify(this.columnArrays), objectName: this.objectApiName,LeadId:this.recordId,recEmail:this.recEmail}).then(result =>{
                let allrecords = [];
                for(let i = 0; i < result.length; i++){
                    let rowData = result[i];
                    let row = rowData;
                    row.Id = rowData.Id;
                    for(let col in this.fieldsForCloumns){
                        if(col.fieldName != 'Id'){
                            row[col.fieldName] = rowData[col.fieldName];
                        }
                    }
                    allrecords.push(row);
                
                }
                this.objectData = allrecords;
                console.log('objectdata', this.objectData);
            }).catch(error => {
                window.alert(error);
            })
        }
        this.iscolumnWindow = false;
    }

    viewLead(event) {
        console.log('inside nav',event.target.dataset.id);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.id,
                objectApiName: 'Lead',
                actionName: 'view'
            }
        });
    }
  
  
    
    
    @track columnTable =[
       {label:'Name', fieldName: 'nameUrl',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Name' }, 
        target: '_blank'}},
      
        {label:'Email',fieldName:'Email',type:'Email'},
        {label:'Company',fieldName:'Company',type:'text'},
    ];
    
    
     
}