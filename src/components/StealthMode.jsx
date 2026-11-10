// [Design Read] Family: Monochrome Minimalist Utilitarian | Variance: 8/10 | Motion: 2/10 | Density: 8/10 | Accent: Stark White (#FFFFFF)
import React from 'react';
import { Atom, FileText, X } from 'lucide-react';

export default function StealthMode({ onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#09090b] text-zinc-300 font-serif overflow-y-auto p-6 sm:p-12 md:p-16 select-text">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#101014] p-8 sm:p-12 rounded-xl border border-zinc-800 shadow-2xl">
        {/* Paper Header */}
        <div className="border-b border-zinc-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
              <Atom className="w-4 h-4 text-zinc-400" />
              <span>International Journal of Theoretical & Quantum Physics &bull; Vol. 48, Iss. 3</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-sans tracking-tight leading-snug">
              Gauge Invariance, Non-Abelian Field Tensor Analysis, and Quantum Decoherence Dynamics in Low-Energy Manifolds
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-3">
              Dr. H. Thorne, Dr. E. R. Vance &bull; Department of Mathematical Physics & Cosmology
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            title="Nhấn Esc để đóng chế độ tàng hình"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Abstract */}
        <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 font-sans text-xs sm:text-sm leading-relaxed text-zinc-300">
          <strong className="text-white uppercase font-mono tracking-wider text-xs block mb-1">Abstract</strong>
          We present a comprehensive formulation of non-perturbative gauge field corrections in symmetric Lorentz invariant frames. By utilizing localized Wilson loops and path-integral perturbation series across boundary hyper-surfaces, we demonstrate that quantum decoherence rates exhibit asymptotic stability under adiabatic expansion. Numerical verification confirms agreement with standard SU(3) lattice simulations within 0.04% standard error.
        </div>

        {/* Section 1 */}
        <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-zinc-400">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono border-b border-zinc-800 pb-1">
            1. Mathematical Formulation & Tensor Representation
          </h2>
          <p>
            Consider a continuous 4-dimensional pseudo-Riemannian manifold \( \mathcal&#123;M&#125; \) equipped with metric signature \( (-, +, +, +) \). The generalized Yang-Mills field strength tensor is given by:
          </p>
          <div className="p-3 my-2 bg-black rounded-lg border border-zinc-800 font-mono text-xs text-zinc-200 text-center overflow-x-auto">
            F_&#123;\mu\nu&#125;^a = \partial_&#123;\mu&#125; A_&#123;\nu&#125;^a - \partial_&#123;\nu&#125; A_&#123;\mu&#125;^a + g f^&#123;abc&#125; A_&#123;\mu&#125;^b A_&#123;\nu&#125;^c
          </div>
          <p>
            where \( g \) denotes the dimensionless coupling constant and \( f^&#123;abc&#125; \) are the structure constants of the underlying Lie algebra \( \mathfrak&#123;su&#125;(N) \). The corresponding action integral satisfies:
          </p>
          <div className="p-3 my-2 bg-black rounded-lg border border-zinc-800 font-mono text-xs text-zinc-200 text-center overflow-x-auto">
            S = -\frac&#123;1&#125;&#123;4&#125; \int d^4x \sqrt&#123;-g&#125; \, \text&#123;Tr&#125;(F_&#123;\mu\nu&#125; F^&#123;\mu\nu&#125;) + \mathcal&#123;L&#125;_&#123;\text&#123;matter&#125;&#125;
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-zinc-400">
          <h2 className="text-base sm:text-lg font-bold text-white font-mono border-b border-zinc-800 pb-1">
            2. Empirical Observational Matrix & Boundary Conditions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-zinc-800">
              <thead className="bg-zinc-900 text-zinc-200">
                <tr>
                  <th className="p-2.5 border-b border-zinc-800">State Vector</th>
                  <th className="p-2.5 border-b border-zinc-800">Eigenvalue \(\lambda\)</th>
                  <th className="p-2.5 border-b border-zinc-800">Decoherence Time (\(\tau\))</th>
                  <th className="p-2.5 border-b border-zinc-800">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-400">
                <tr>
                  <td className="p-2.5 font-bold text-zinc-200">| \Psi_1 \rangle</td>
                  <td className="p-2.5">1.4142 \pm 0.002</td>
                  <td className="p-2.5">4.82 \times 10^&#123;-15&#125; s</td>
                  <td className="p-2.5 text-emerald-400">Converged</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-zinc-200">| \Psi_2 \rangle</td>
                  <td className="p-2.5">2.7182 \pm 0.005</td>
                  <td className="p-2.5">8.19 \times 10^&#123;-15&#125; s</td>
                  <td className="p-2.5 text-emerald-400">Converged</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-zinc-200">| \Psi_3 \rangle</td>
                  <td className="p-2.5">3.1415 \pm 0.001</td>
                  <td className="p-2.5">1.24 \times 10^&#123;-14&#125; s</td>
                  <td className="p-2.5 text-emerald-400">Stable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Manuscript ID: PHY-2026-X882</span>
          <span className="text-zinc-400">Bấm phím <strong>[ESC]</strong> hoặc nút X để quay lại</span>
        </div>
      </div>
    </div>
  );
}

