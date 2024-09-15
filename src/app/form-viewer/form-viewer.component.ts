import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistDto } from '../app.form.model';
import { FormService } from './form-viewer.service';
import { NgxImageCompressService  } from 'ngx-image-compress';

@Component({
  selector: 'app-form-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[NgxImageCompressService],

  templateUrl: './form-viewer.component.html',
  styleUrl: './form-viewer.component.scss'
})
export class FormViewerComponent implements OnInit {

  isAdmin: string | null = null;
  errorMessage: string | null = null;
  id:number|null=null;
  showError:boolean=false;
  photoExist:boolean=false;
  isLoading: boolean = false;
  showSuccessPopup: boolean = false;
  photo: File | null = null;
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
    payment: new FormControl(''),
    photo: new FormControl<File | null>(null, [Validators.required])

  })


  constructor(private router: Router, private formService: FormService, 
              private route: ActivatedRoute, private imageCompress: NgxImageCompressService) {
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
            payment: registDto.payment,
          });
          if(registDto.photo){
            this.photoExist = true;
            this.form.get('photo')?.setErrors(null)
          }
          

         
          
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
      this.isLoading= true;
      const formData = new FormData();
      formData.append('registDto', new Blob([JSON.stringify({
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
    })], { type: 'application/json' }));

    // Append the file (photo) if it exists
    // const photo = this.form.get('photo')?.value as File;
    if (this.photo) {
        formData.append('photo', this.photo);
    }
     

      this.formService.registerDetail(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessPopup = true
          if(!Number.isNaN(this.id)){
            this.router.navigate(['admin'])
          }else {
            // this.router.navigate([''])
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
  photoError: string | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if(file){

    // const input = event.target as HTMLInputElement;
  // if (input.files && input.files.length > 0) {
    // const file = input.files[0];
    if (file.type.startsWith('image/')) {
      const reader  = new FileReader()

      reader.onload = (e: any)=> {
        const img = e.target.result
         // Compress the image before uploading (set quality and dimensions)
         this.imageCompress.compressFile(img, -1, 50, 50).then((compressedImage) => {
          // Convert compressed image back to a blob
          const blob = this.dataURLToBlob(compressedImage);

          this.photo = new File([blob], file.name, { type: file.type });
          this.photoError = null;
          this.photoExist = true;
          this.form.get('photo')?.setErrors(null); // Clear errors
         })
      }
   
      reader.readAsDataURL(file);
    } else {
      this.photoError = 'Please select a valid image file.';
      this.photoExist = false;
    }
  }
  }

  dataURLToBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  closePopup(): void {
    this.showSuccessPopup = false;  // Hide the popup
    this.router.navigate([''])
  }
}





