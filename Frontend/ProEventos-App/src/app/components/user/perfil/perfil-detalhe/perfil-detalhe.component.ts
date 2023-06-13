import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { PalestranteService } from '@app/services/palestrante.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss'],
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();

  form!: FormGroup;
  userUpdate = {} as UserUpdate;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public accountService: AccountService,
    public palestranteService: PalestranteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.validation();
    this.carregarUtilizador();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges.subscribe(() =>
      this.changeFormValue.emit({ ...this.form.value })
    );
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
        imagemURL: [''],
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

  get f(): any {
    return this.form.controls;
  }

  onSubmit(): void {
    this.atualizarUtilizador();
  }

  public atualizarUtilizador() {
    this.userUpdate = { ...this.form.value };

    if (this.f.funcao.value === 'Palestrante') {
      this.palestranteService.postPalestrante().subscribe(
        () => this.toastr.success('Função palestrante Ativada!', 'Sucesso'),
        (error: any) => {
          this.toastr.error(
            'A função palestrante não pôde ser ativada',
            'Error'
          );
          console.error(error);
        }
      );
    }

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toastr.success('Utilizador atualizado!', 'Sucesso'),

      (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao atulizar o utilizador!', 'Error');
      },
      () => {}
    );
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }
}
