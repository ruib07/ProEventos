import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventoId!: number;
  public pagination = {} as Pagination;

  public widthImg: number = 150;
  public marginImg: number = 2;
  public exibirImagem: boolean = true;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;
    this.carregarEventos();
  }

  termoSearchChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void {
    if (this.termoSearchChanged.observers.length === 0) {
      this.termoSearchChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error: (error: any) => {
                this.toastr.error('Erro ao carregar os eventos.', 'Erro');
              },
            });
        });
    }
    this.termoSearchChanged.next(evt.value);
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
    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
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

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
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
