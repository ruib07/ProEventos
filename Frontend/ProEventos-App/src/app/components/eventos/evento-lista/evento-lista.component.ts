import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId!: number;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public exibirImagem: boolean = true;
  private filtroListado: string = '';

  public get filtrolista(): string {
    return this.filtroListado;
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.carregarEventos();
  }

  public set filtrolista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtrolista
      ? this.filtrarEventos(this.filtrolista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public mostraImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/semImagem.png';
  }

  public alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar os eventos.', 'Erro');
      },
    });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if (result.message === 'Eliminado') {
          this.toastr.success(
            'O Evento foi eliminado com sucesso.',
            'Eliminado'
          );
          this.carregarEventos();
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error(
          `Erro ao tentar eliminar o evento ${this.eventoId}`,
          'Erro'
        );
      },
      () => {}
    );
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
