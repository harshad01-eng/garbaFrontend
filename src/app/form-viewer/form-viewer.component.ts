import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistDto } from '../app.form.model';
import { FormService } from './form-viewer.service';

@Component({
  selector: 'app-form-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './form-viewer.component.html',
  styleUrl: './form-viewer.component.scss'
})
export class FormViewerComponent implements OnInit {

  isAdmin: string | null = null;
  errorMessage: string | null = null;
  id:number|null=null;
  showError:boolean=false;
  ageOptions: number[] = Array.from({ length: 58 }, (_, i) => i + 3);
  form = new FormGroup({
    id: new FormControl<number | null>(null), // Include id
    regsNo: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]),
    batchTime: new FormControl('', Validators.required),
    gender: new FormControl(''),
    age: new FormControl<number | null>(null, [Validators.required]), 
    address: new FormControl(''),
    payment: new FormControl('')

  })


  constructor(private router: Router, private formService: FormService, 
              private route: ActivatedRoute) {
    if (typeof localStorage !== 'undefined') {
      if( localStorage.getItem("userRole") !== undefined && localStorage.getItem("userRole") !== null ){
      this.isAdmin = localStorage.getItem("userRole");
      this.form.get('payment')?.setValidators([Validators.required]);
    }
  }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']
      if(!Number.isNaN(this.id)){
        this.formService.getDetailById(this.id).subscribe((registDto:RegistDto) => {
          
          this.form.patchValue({
            id: registDto.id,
            regsNo: registDto.regsNo,
            firstName: registDto.firstName,
            lastName: registDto.lastName,
            mobileNo: registDto.mobileNo,
            batchTime: registDto.batchTime,
            gender: registDto.gender,
            age: registDto.age,
            address: registDto.address,
            payment: registDto.payment
          });
          
        })
      }
     
    })
  }
  clickCancel() {
    if(!Number.isNaN(this.id)){
      this.router.navigate(['admin'])
    }else {
      this.router.navigate([''])
    }
   

  }
  formSubmit() {
    if (this.form.valid) {
      const registDto: RegistDto = {
        id: this.form.get('id')?.value ?? 0,
        regsNo: this.form.get('regsNo')?.value || '',
        firstName: this.form.get('firstName')?.value || '',
        lastName: this.form.get('lastName')?.value || '',
        mobileNo: this.form.get('mobileNo')?.value || '',
        batchTime: this.form.get('batchTime')?.value || '',
        gender: this.form.get('gender')?.value || '',
        age: Number(this.form.get('age')?.value) || 0,
        address: this.form.get('address')?.value || '',
        payment: this.form.get('payment')?.value || '',
      };

      this.formService.registerDetail(registDto).subscribe({
        next: (response) => {
          if(!Number.isNaN(this.id)){
            this.router.navigate(['admin'])
          }else {
            this.router.navigate([''])
          }
        },
        error: (error) => {
          this.errorMessage = error.error;
          this.showError = true
          // Optionally show an error message to the user
        }
      });
    } else {
      console.log('Form is not valid');
      // Optionally handle the case where the form is invalid
    }
  }




}
