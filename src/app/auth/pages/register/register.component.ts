import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent{

  miFormulario: FormGroup = this.fb.group({
    name: ['Cabesa', Validators.required],
    email: ['emailnuevo@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  constructor( private fb: FormBuilder) { 

  }

  crearUsuario() {
    console.log(this.miFormulario.value);
  }
}
