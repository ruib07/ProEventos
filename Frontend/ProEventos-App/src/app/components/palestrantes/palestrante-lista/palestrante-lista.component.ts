import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss'],
})
export class PalestranteListaComponent implements OnInit {
  public Palestrantes: Palestrante[] = [];
  public eventoId!: number;
  public pagination = {} as Pagination;

  constructor(
    private palestranteService: PalestranteService,
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

    this.carregarPalestrantes();
  }

  termoSearchChanged: Subject<string> = new Subject<string>();

  public filtrarPalestrantes(evt: any): void {
    if (this.termoSearchChanged.observers.length === 0) {
      this.termoSearchChanged
        .pipe(debounceTime(1000))
        .subscribe((filtrarPor) => {
          this.palestranteService
            .getPalestrantes(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
                this.Palestrantes = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error: (error: any) => {
                console.error(error);
                this.toastr.error('Erro ao carregar os Palestrantes.', 'Erro');
              },
            });
        });
    }
    this.termoSearchChanged.next(evt.value);
  }

  public getImagemURL(imagemName: string): string {
    if (imagemName) {
      return environment.apiURL + `Resources/Perfil/${imagemName}`;
    }
    else {
      return './assets/perfil.jpg';
    }
  }

  public carregarPalestrantes(): void {
    this.palestranteService
      .getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (paginatedResult: PaginatedResult<Palestrante[]>) => {
          this.Palestrantes = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        error: (error: any) => {
          console.error(error);
          this.toastr.error('Erro ao carregar os palestrantes.', 'Erro');
        },
      });
  }
}
