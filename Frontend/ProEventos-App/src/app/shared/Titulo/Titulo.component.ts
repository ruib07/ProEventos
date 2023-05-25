import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Titulo',
  templateUrl: './Titulo.component.html',
  styleUrls: ['./Titulo.component.scss']
})
export class TituloComponent implements OnInit {
  @Input() titulo = '';
  @Input() iconClass = 'fa fa-user';
  @Input() subtitulo = 'Desde 2023';
  @Input() botaoListar = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  list(): void {}

  listar(): void {
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`])
  }

}
