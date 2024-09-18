import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { FormService } from '../form-viewer/form-viewer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RegistDto } from '../app.form.model';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [AgGridAngular,CommonModule, AgGridModule,FormsModule],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})  
export class DataGridComponent implements OnInit {


  private gridApi:any;
  isBrowser: boolean;
  showGrid:boolean = false
  passWord:string='';
  errorMessage: string |null = null;
  rowData: RegistDto[]=[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router:Router, private formService: FormService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (typeof localStorage !== 'undefined') {
    if( localStorage.getItem("userRole") !== undefined && localStorage.getItem("userRole") !== null ){
      this.showGrid = true
    }
  }
    
    
  }
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    this.submit();
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      if( localStorage.getItem("userRole") !== undefined && localStorage.getItem("userRole") !== null ){
        this.getData()
  }
  }
}


 
  colDefs: ColDef[] = [
    { field: "firstName", flex:1, floatingFilter:true, filter:true },
    { field: "lastName", flex:1,floatingFilter:true, filter:true  },
    { field: "mobileNo",flex:1,floatingFilter:true, filter:true  },
    { field: "age",flex:1  },
    { field: "gender",flex:1, headerName:"Category",floatingFilter:true, filter:true },
    { field: "batchTime",flex:1 },
    { field: "payment",flex:1, cellStyle: (params)=> {
      if(params.value === 'solo'){
        return {backgroundColor: '#00CC00', color: 'black'}
      }else if(params.value === 'group'){
        return {backgroundColor: '#FFFF00', color: 'black'}
      }else if(params.value === 'kids'){
        return {backgroundColor: '#0000FF', color: 'white'}
      }
      return {backgroundColor: '#FCBCAF', color: 'white'}; 
    }},
    {headerName:"Registration NO", field: "regsNo",flex:1,floatingFilter:true, filter:true },
    { field: "address",flex:2  },
    { headerName:"Actions", field: "actions",flex:1 , cellRenderer: this.actionCellRenderer.bind(this),sortable: false,
      filter: false, }
  ];

  actionCellRenderer(params: any) {
    const eDiv = document.createElement('div')

    const editButton = document.createElement('div')
    editButton.className= 'btn btn-sm btn-primary me-2';
    editButton.innerHTML='<i class="bi bi-pencil"></i>'
    // editButton.style.cursor= 'pointer';  
    editButton.addEventListener('click', ()=> this.onEdit(params.data.id) )

    const viewButton = document.createElement('div')
    viewButton.className= 'btn btn-sm btn-primary';
    viewButton.innerHTML='<i class="bi bi-eye"></i>'
    // editButton.style.cursor= 'pointer';  
    viewButton.addEventListener('click', ()=> this.onView(params.data.id) )

    eDiv.appendChild(editButton);
    eDiv.appendChild(viewButton);
    return eDiv
  }

  onEdit(id: number) {
    this.router.navigate(['/edit', id]);
  }

  onView(id: number){
    this.router.navigate(['/view', id]);
  }

  submit() {
    this.formService.login("admin",this.passWord).subscribe(res => {
      localStorage.setItem("userRole","admin")
      this.getData();
      this.showGrid = true;
    },(error: HttpErrorResponse) =>  {
      this.errorMessage = error.error.message
      
    })
   
    }

    getData(){
      this.formService.getAllData().subscribe(res => {
        this.rowData = res
      })
    }

    checkPassword(){
      if(this.passWord === ''){
        this.errorMessage = null
      }
    }

    logoutUser(){
      localStorage.clear()
      this.router.navigate([''])
    }

    back(){
        this.router.navigate([''])
    }

    onGridReady(event: GridReadyEvent<RegistDto,any>) {
      this.gridApi = event.api;
      }

      exportExcel(){
        const rowData: any[] = [];
        this.gridApi.forEachNode((node: any) => {
          const { photo, ...dataWithoutPhoto } = node.data;
          rowData.push(dataWithoutPhoto);
        });
    
        // Create a worksheet with the row data
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rowData);
    
        // Create a workbook and add the worksheet to it
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'All Data');
    
        // Export the workbook to an Excel file
        XLSX.writeFile(workbook, 'UDAAN.xlsx');
      }
}
