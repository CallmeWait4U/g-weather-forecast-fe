import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../http.service';

interface ILogin {
  id: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-dialog-account',
  templateUrl: './dialog-account.component.html',
  styleUrls: ['./dialog-account.component.scss']
})
export class DialogAccountComponent implements OnInit {
  loginForm!: FormGroup<ILogin>;
  controls!: ILogin;
  @Output() dataUser = new EventEmitter<{email: string, registered: boolean, searchedList: string[]}>();
  
  constructor(
    private httpService: HttpService, 
    @Inject(MAT_DIALOG_DATA) public data: { signIn: boolean }, 
    private ref: MatDialogRef<DialogAccountComponent>,
    private fb: FormBuilder
  ) {
    console.log(data?.signIn)
  }

  ngOnInit(): void {
    this.setForm();
  }
  
  checkValid(control: FormControl) {
    if (control.invalid && control.touched) {
      return 'show';
    }
    return;
  }

  getFormInvalidMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'Trường dữ liệu bắt buộc';
    }
    return '';
  }

  setForm() {
    this.loginForm = this.fb.group<ILogin>({
      id: new FormControl(null),
      email: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
    })
    this.controls = this.loginForm.controls;
  }

  submit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      const raws = this.loginForm.getRawValue();
      if (this.data.signIn) {
        this.httpService.signIn(raws).subscribe((res) => {
          this.dataUser.emit(res.data)
          this.ref.close();
        })
      } else {
        this.httpService.signUp(raws).subscribe(() => {
          this.ref.close(true);
        })
      }
    }
  }

}
