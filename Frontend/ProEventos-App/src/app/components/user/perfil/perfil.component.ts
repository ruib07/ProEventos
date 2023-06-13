import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public utilizador = {} as UserUpdate;
  public imagemURL = '';
  public file: File;

  public get ehPalestrante(): boolean {
    return this.utilizador.funcao === 'Palestrante';
  }

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {}

  public setFormValue(utilizador: UserUpdate): void {
    this.utilizador = utilizador;
    if (this.utilizador.imagemURL)
      this.imagemURL =
        environment.apiURL + `Resources/Perfil/${this.utilizador.imagemURL}`;
    else this.imagemURL = './assets/perfil.jpg';
  }

  onFileChange(e: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = e.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.accountService.postUpload(this.file).subscribe(
      () => this.toastr.success('Imagem Atualizada com sucesso!', 'Sucesso'),
      (error: any) => {
        this.toastr.error('Erro ao atualizar imagem!', 'Erro');
        console.error(error);
      }
    );
  }
}
