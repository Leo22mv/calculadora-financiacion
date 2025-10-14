import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('calculadora-financiacion');

  monto: number | undefined;
  interes: number | undefined;
  cuota: number | undefined;
  meses: number | undefined;

  resultado: string | undefined;

  calcular() {
    if (this.monto && this.interes && this.meses) {
      const interesFinanciado = (this.interes / 100) * this.meses;
      const totalAFinanciar = this.monto + (this.monto * interesFinanciado);
      this.cuota = totalAFinanciar / this.meses;
      this.resultado = `El monto a financiar es de ${totalAFinanciar.toFixed(2)} y la cuota mensual es de ${this.cuota.toFixed(2)}`;
    }

    if (this.monto && this.interes && this.cuota) {
      let mesesCalculados = 1;
      let cuotaCalculada = 0;

      while (mesesCalculados < 1000) { // límite para evitar bucle infinito
        const interesFinanciado = (this.interes / 100) * mesesCalculados;
        const totalAFinanciar = this.monto + (this.monto * interesFinanciado);
        cuotaCalculada = totalAFinanciar / mesesCalculados;

        if (cuotaCalculada <= this.cuota) break;
        mesesCalculados++;
      }
      this.meses = mesesCalculados;
      this.resultado = `Con una cuota de ${this.cuota.toFixed(2)}, el préstamo se pagará en ${mesesCalculados} meses.`;
    }
  }
}
