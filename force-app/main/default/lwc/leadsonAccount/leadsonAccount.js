import { LightningElement ,track,api,wire } from 'lwc';
import leadList from '@salesforce/apex/duplicateRecordsFinder.leadList';
import { NavigationMixin } from 'lightning/navigation';
//import leadconvert2  from '@salesforce/apex/duplicateRecordsFinder.leadconvert2';
import getField from '@salesforce/apex/duplicateRecordsFinder.getAllColumnsDetail';
import  UpdatedDatatableonAccount from '@salesforce/apex/duplicateRecordsFinder.UpdatedDatatableonAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCustomSettings from '@salesforce/apex/duplicateRecordsFinder.getCustomSettings';


export default class LeadsonAccount extends LightningElement {

    @track iscolumnWindow = false;
    @track customDT=true;
    @track minField;
    @track maxField;
    @track allFields = [];
    @track allSelectedField = [];
    @api objectData = [];
    @track columnArrays = [];
    @track fieldsForColumn = [];
   
    requiredOptions = [];
    @track all=[];


    @track fixeddata=[];
    loaded = false;
//@track recordId='00Q1y000001przHEAQ';
@api recordId;
@track message;
@track Name;
@track error;
@track Email;
@track Id;
@api objectApiName;
@track Company;
@track LeadOwner;
@track showTable=true;
@track getBlockDomainRes='';
@track stringWithoutComma;
@track customDT=true;
@track selectedIdsArray = [];
@track AccountrecordId;

@track columnTable =[
   {label:'Name', fieldName: 'nameUrl',
    type: 'url',
    typeAttributes: {label: { fieldName: 'Name' }, 
    target: '_blank'}},
    {label:'Email',fieldName:'Email',type:'Email'},
    {label:'Company',fieldName:'Company',type:'text'},
];


  connectedCallback(){
    console.log('objectAiNmae>>>>>',this.objectApiName);
    console.log('orecordID>>>>>',this.recordId);

    getCustomSettings().then(result=>{
        console.log('inside get custom cs result>>>>>',JSON.stringify(result));
        if(result.length>0){
            for(let x in result){
               
                this.getBlockDomainRes+=result[x].Name + ',' ;
                this.stringWithoutComma =   this.getBlockDomainRes.replace(/,*$/, "")
                console.log('comma seprated list is----> '+ this.stringWithoutComma);
            }
         }
       //   this.getBlockDomainRes=result;
        
      }).catch(error=>{
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error ',
                message: error.body.message,
                variant: 'error',
            }),
        ); 
      })
    
        leadList({recId:this.recordId,objectName:this.objectApiName}).then(result=>{
            console.log('accountId>>',this.recordId);
             this.message=result;
             console.log('result>>>>>>>>>>>>>',JSON.stringify(result));
           
       if(this.message.length === 0){
        this.loaded = !this.loaded;
        this.showTable= false;
        this.customDT=false;
        console.log('length>>>'+this.message.length);

         }  else{
            this.loaded = !this.loaded;
            this.showTable= true;
            console.log('else---length>>>'+this.message.length);
        }
    
             console.log('result>>>>>',JSON.stringify(result));
            // console.log('track columntable',this.columnTable);
          
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
         }).catch(error=>{
             this.error='Error';
         })

       /*  //custom table
         const selectedFields = this.allSelectedField;
        
            console.log('*****************************8selected field', selectedFields);
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
            UpdatedDatatableonAccount({selectedField : JSON.stringify(this.columnArrays), objectName: this.objectApiName,recId:this.recordId}).then(result =>{
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
                  //  this.columnTable = [...this.columnTable, ...row[col.fieldName]];
                  //  console.log('columntable>>>>>>>>>>>>>'+ this.columnTable);
                }
                this.objectData = allrecords;
            }).catch(error => {
                window.alert(error);
            })
        
        this.iscolumnWindow = false;*/
            
          

      }
    

      @wire(getField, {objectApiName : 'Lead'}) setObjectField({error, data}){
       
        if(data){
            console.log('***inside wire ****objectApiname>>>>',this.objectApiName);
            console.log('wire---data>>>>',data);
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
        this.AccountrecordId=this.recordId;

        this.customDT=false;
       // allSelectedField+=this.allSelectedField.push('Company');
      // this.allSelectedField.push(...['Company']);
        console.log('selected values>>>',  valueSelected);
        console.log('scustomDT>>>',  this.customDT);
        console.log('AccountRecordId>>>',  this.AccountrecordId);
    }

    showColumnSelectionWindow(event){
        this.iscolumnWindow = true;
        this.requiredOptions.push(...['Website']);
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
            this.fieldsForColumn  = addfields;
            this.columnArrays = fieldAPI;
            UpdatedDatatableonAccount({selectedField : JSON.stringify(this.columnArrays), objectName: this.objectApiName,recId:this.recordId}).then(result =>{
                console.log('inside updatedtable');
                let allrecords = [];
                for(let i = 0; i < result.length; i++){
                    let rowData = result[i];
                    let row = rowData;
                    row.Id = rowData.Id;
                    for(let col in this.fieldsForColumn ){
                        if(col.fieldName != 'Id'){
                            row[col.fieldName] = rowData[col.fieldName];
                        }
                    }
                    allrecords.push(row);
                
                }
                this.objectData = allrecords;
                console.log('objectData>>>>>>>>>>>>>'+ JSON.stringify(this.objectData));

            }).catch(error => {
                window.alert(error);
            })
        }
        this.iscolumnWindow = false;
    }
  

}