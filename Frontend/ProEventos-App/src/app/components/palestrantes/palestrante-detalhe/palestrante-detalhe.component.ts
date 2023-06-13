import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss'],
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    private palestranteService: PalestranteService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.validation();
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation(): void {
    this.form = this.fb.group({
      miniCurriculo: [''],
    });
  }

  private carregarPalestrante(): void {
    this.palestranteService.getPalestrante().subscribe(
      (palestrante: Palestrante) => {
        this.form.patchValue(palestrante);
      },
      (error: any) => {
        this.toastr.error('Erro ao carregar o Palestrante', 'Erro');
        console.error(error);
      }
    );
  }

  public get f(): any {
    return this.form.controls;
  }

  private verificaForm(): void {
    this.form.valueChanges
      .pipe(
        map(() => {
          this.situacaoDoForm = 'Minicurrículo está a ser atualizado';
          this.corDaDescricao = 'text-warning';
        }),
        debounceTime(1000)
      )
      .subscribe(() => {
        this.palestranteService
          .putPalestrante({ ...this.form.value })
          .subscribe(
            () => {
              this.situacaoDoForm = 'Minicurrículo foi atualizado!';
              this.corDaDescricao = 'text-success';

              setTimeout(() => {
                this.situacaoDoForm = 'Minicurrículo carregado';
                this.corDaDescricao = 'text-muted';
              }, 2000);
            },
            (error: any) => {
              this.toastr.error('Erro ao tentar atualizar palestrante', 'Erro');
              console.error(error);
            }
          );
      });
  }
}
