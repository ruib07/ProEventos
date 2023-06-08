import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  modalRef?: BsModalRef;
  form!: FormGroup;
  userUpdate = {} as UserUpdate;

  get f(): any {
    return this.form.controls;
  }

  onSubmit(): void {
    this.atualizarUtilizador();
  }

  public atualizarUtilizador() {
    this.userUpdate = { ...this.form.value };

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toastr.success('Utilizador atualizado!', 'Sucesso'),

      (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao atulizar o utilizador!', 'Error');
      },
      () => {}
    );
  }

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validation();
    this.carregarUtilizador();
  }

  private carregarUtilizador(): void {
    this.accountService.getUser().subscribe(
      (userReturn: UserUpdate) => {
        console.log(userReturn);
        this.userUpdate = userReturn;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Utilizador carregado com sucesso!', 'Sucesso');
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao carregar o utilizador!', 'Erro');
        this.router.navigate(['/dashboard']);
      },
      () => {}
    );
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword'),
    };

    this.form = this.fb.group(
      {
        userName: [''],
        titulo: ['NaoInformado', Validators.required],
        primeiroNome: ['', Validators.required],
        apelido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        funcao: ['NaoInformado', Validators.required],
        descricao: ['', Validators.required],
        password: ['', [Validators.nullValidator, Validators.minLength(4)]],
        confirmPassword: ['', Validators.nullValidator],
      },
      formOptions
    );
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('O Perfil foi editado com sucesso.', 'Editado');
  }

  decline(): void {
    this.modalRef?.hide();
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }
}
