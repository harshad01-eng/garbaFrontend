import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../form-viewer/form-viewer.service';
import { RegistDto } from '../app.form.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  templateUrl: './form-detail.component.html',
  styleUrl: './form-detail.component.scss'
})
export class FormDetailComponent implements OnInit{

  userDetails: RegistDto[]=[];
  errorMessage: string | null = null;
  id:number | null = null
  public showDetail:boolean=false;

  form= new FormGroup({
    mobileNo: new FormControl('',
      [Validators.required, 
      Validators.minLength(10),
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(10)]),
  })
  

  constructor(private formService:FormService, private router:Router, private route:ActivatedRoute){}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if(!Number.isNaN(this.id)){
        this.formService.getDetailById(this.id).subscribe((registDto:RegistDto) => {
          this.form.patchValue({
            mobileNo:registDto.mobileNo
          })
          this.userDetails[0] = registDto;
          this.showDetail = true
          this.errorMessage = null
          
        });
      }
    })
  }

 
  


 

  onSubmit() {
    this.formService.getDetailByMobileNo(this.form.get('mobileNo')?.value || '').subscribe({
      next:(data : RegistDto[]) => {
        if(data.length !== 0){
        this.userDetails = data;
        this.showDetail = true
        this.errorMessage = null
        }
      },
      error: (error) => {
        this.errorMessage = error.error
      }
    })
   
    }

    checkMobileNo(){
      if (this.form.get('mobileNo')?.value === ''){
      this.errorMessage = null
      }
    }

    onCancel() {
     window.history.back();
    }

  
}
