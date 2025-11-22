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

  monto: string | undefined;
  interes: number | undefined;
  cuota: any;
  meses: number | undefined;

  cuotasDisabled: boolean = false;
  mesesDisabled: boolean = false;

  resultado: string | undefined;
  error: string | undefined;

  calcular() {
    if (this.monto) {
      const monto: number = Number(this.monto.replace(/,/g, ''));
      console.log('Monto procesado:', monto);
      if (this.interes && this.meses) {
        const interesFinanciado = (this.interes / 100) * this.meses;
        // console.log('monto -> {}', monto);
        const totalAFinanciar: number = Number(monto + (monto * interesFinanciado));

        this.cuota = (totalAFinanciar / this.meses);
        const objetoCuotaSinComas = { target: { value: this.cuota.toString() } }
        this.onInput(objetoCuotaSinComas);
        this.cuota = objetoCuotaSinComas.target.value;
        this.resultado = `El monto a financiar es de ${totalAFinanciar.toFixed(2)} y la cuota mensual es de ${this.cuota}`;
      }

      if (this.interes && this.cuota) {
        const cuota: number = Number(this.cuota.replace(/,/g, ''));
        let mesesCalculados = 1;
        let cuotaCalculada = 0;

        while (mesesCalculados < 120) {
          const interesFinanciado = (this.interes / 100) * mesesCalculados;
          const totalAFinanciar: number = monto + (monto * interesFinanciado);
          cuotaCalculada = totalAFinanciar / mesesCalculados;3
          // console.log('cuotaCalculada -> ', cuotaCalculada);

          if (cuotaCalculada <= cuota) break;

          mesesCalculados++;

          if (mesesCalculados == 120) {
            this.cuota = Number(cuotaCalculada).toFixed(2).toString();
            const objetoCuotaSinComas = { target: { value: this.cuota.toString() } }
            this.onInput(objetoCuotaSinComas);
            this.cuota = objetoCuotaSinComas.target.value;
            break;
          }
        }
        this.meses = mesesCalculados;
        this.resultado = `Con una cuota de ${this.cuota}, el préstamo se pagará en ${mesesCalculados} meses.`;
        this.error = undefined;
      }
    }

    if (!this.monto || !this.interes || (!this.cuota && !this.meses)) {
      this.error = 'Por favor, complete todos los campos necesarios para el cálculo.';
      this.resultado = undefined;
    }
  }

  validarCuotaYMeses() {
    if (this.cuota && !this.meses) {
      if (!this.cuotasDisabled) {
        this.mesesDisabled = true;
      } else {
        this.cuotasDisabled = false;
        this.cuota = undefined;
      }
    }
    if (this.meses && !this.cuota) {
      if (!this.mesesDisabled) {
        this.cuotasDisabled = true;
      } else {
        this.mesesDisabled = false;
        this.meses = undefined;
      }
    }
    if (!this.meses && !this.cuota) {
      this.cuotasDisabled = false;
      this.mesesDisabled = false;
    }
  }

  onInput(event: any) {
    const input = event.target.value;

    // quitar comas antes de procesar
    const numeric = input.replace(/,/g, '');

    // si no es número, salir
    if (isNaN(Number(numeric))) {
      event.target.value = '';
      return;
    }

    // guardar valor crudo (para enviar al backend)
    let rawValue = Number(numeric);

    // formatear con comas
    let formattedValue = Number(numeric).toLocaleString('en-US');

    if (formattedValue === '0') {
      return;
    }

    // actualizar campo mostrado
    event.target.value = formattedValue;
  }
}
