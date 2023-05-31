import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoGuardar = 'post';
  loteAtual = { id: 0, nome: '', indice: 0 };

  get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean {
    return this.estadoGuardar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.estadoGuardar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          this.carregarLotes();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar carrega Evento.', 'Erro!');
          console.log(error);
        },
        () => {}
      );
    }
  }

  public carregarLotes(): void {
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno: Lote[]) => {
        lotesRetorno.forEach((lote) => {
          this.lotes.push(this.criarLote(lote));
        });
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Erro ao tentar carregar lotes!', 'Error');
      },
      () => {}
    );
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === '' ? 'Nome do Lote' : nome;
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public guardarEvento(): void {
    if (this.form.valid)
      if (this.estadoGuardar === 'post') {
        this.evento = { ...this.form.value };
        this.eventoService.postEvento(this.evento).subscribe(
          (eventoRetorno: Evento) => {
            this.toastr.success('Evento guardado com sucesso!', 'Sucesso');
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao guardar o evento!', 'Erro');
          },
          () => {}
        );
      } else {
        this.evento = { id: this.evento.id, ...this.form.value };
        this.eventoService.putEvento(this.evento.id, this.evento).subscribe(
          () => {
            this.toastr.success('Evento guardado com sucesso!', 'Sucesso');
          },
          (error: any) => {
            console.error(error);
            this.toastr.error('Erro ao guardar o evento!', 'Erro');
          },
          () => {}
        );
      }
  }

  public guardarLotes(): void {
    if (this.form.controls.lotes.valid) {
      this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
        () => {
          this.toastr.success('Lotes guardados com sucesso!', 'Sucesso');
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao tentar guardar lotes!', 'Erro');
        },
        () => {}
      );
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success('Lote eliminado com sucesso!', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(
          `Erro ao eliminar Lote ${this.loteAtual.id}!`,
          'Erro'
        );
      },
      () => {}
    );
  }

  declineDeleteLote(): void {
    this.modalRef.hide();
  }
}
