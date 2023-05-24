import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

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
     private toastr: ToastrService
     ){}

  public ngOnInit(): void {
    this.getEventos();
  }

  public set filtrolista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtrolista ? this.filtrarEventos(this.filtrolista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar os eventos.', 'Erro');
      }
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('O Evento foi eliminado com sucesso.', 'Eliminado');
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
