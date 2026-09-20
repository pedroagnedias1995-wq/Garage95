import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Wrench, 
  CheckCircle2, 
  DollarSign,
  Car
} from 'lucide-react';
import { Vehicle } from '../types';

interface ValuationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userVehicles: Vehicle[];
}

export const ValuationCalculatorModal: React.FC<ValuationCalculatorModalProps> = ({
  isOpen,
  onClose,
  userVehicles
}) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState('Ford');
  const [model, setModel] = useState('Mustang Fastback');
  const [year, setYear] = useState(1967);
  const [plateType, setPlateType] = useState<'preta' | 'mercosul' | 'colecao'>('preta');
  const [conditionGrade, setConditionGrade] = useState<'concours' | 'excelente' | 'bom' | 'restauracao'>('excelente');
  const [hasOriginalEngine, setHasOriginalEngine] = useState(true);
  const [hasFivaCert, setHasFivaCert] = useState(true);
  const [interiorCondition, setInteriorCondition] = useState<'100% Original' | 'Restaurado em Couro' | 'Necessita Reparo'>('100% Original');

  // Calculation formula
  const basePrices: Record<string, number> = {
    'Ford': 180000,
    'Chevrolet': 160000,
    'Volkswagen': 85000,
    'Dodge': 240000,
    'Puma': 95000,
    'Porsche': 450000,
    'Ferrari': 900000,
    'Alfa Romeo': 140000
  };

  const basePrice = basePrices[brand] || 120000;
  
  let multiplier = 1.0;
  if (conditionGrade === 'concours') multiplier *= 1.45;
  if (conditionGrade === 'excelente') multiplier *= 1.2;
  if (conditionGrade === 'bom') multiplier *= 0.9;
  if (conditionGrade === 'restauracao') multiplier *= 0.45;

  if (plateType === 'preta') multiplier *= 1.25;
  if (hasOriginalEngine) multiplier *= 1.2;
  if (hasFivaCert) multiplier *= 1.15;

  const estimatedValue = Math.round(basePrice * multiplier);
  const minRange = Math.round(estimatedValue * 0.9);
  const maxRange = Math.round(estimatedValue * 1.15);

  const estimatedRestorationCost = conditionGrade === 'restauracao' ? 120000 : conditionGrade === 'bom' ? 35000 : 8000;
  const appreciationProjection5Years = Math.round(estimatedValue * 1.38);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#172018] border border-[#D4AF37]/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3B4D3A]/60 bg-[#141C15]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#F3E5AB]">
                Simulador de Avaliação & Índice FIVA
              </h3>
              <p className="text-xs text-[#8EA290]">Estimativa de valor de mercado e potencial de valorização de clássicos.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#8EA290] hover:text-[#E8ECE8] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Marca</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet / GM</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Dodge">Dodge / Chrysler</option>
                <option value="Puma">Puma</option>
                <option value="Porsche">Porsche</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Ferrari">Ferrari</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Modelo / Carroceria</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Ano de Fabricação</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] font-mono focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Placa / Homologação</label>
              <select
                value={plateType}
                onChange={(e) => setPlateType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="preta">Placa Preta Colecionador (+95pts)</option>
                <option value="colecao">Certificado Mercosul Coleção</option>
                <option value="mercosul">Placa Padrão Mercosul</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8EA290] mb-1">Grau de Conservação</label>
              <select
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#121713] border border-[#3B4D3A] rounded-xl text-xs text-[#E8ECE8] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="concours">Nível Concours d'Elegance (Originalidade Máxima)</option>
                <option value="excelente">Excelente Estado de Conservação / Restaurado</option>
                <option value="bom">Bom Estado / Uso Frequente</option>
                <option value="restauracao">Projeto Necessitando Restauração</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 bg-[#141C15] p-3 rounded-xl border border-[#3B4D3A]/40">
            <label className="flex items-center gap-2 text-xs text-[#B4C4B6] cursor-pointer">
              <input
                type="checkbox"
                checked={hasOriginalEngine}
                onChange={(e) => setHasOriginalEngine(e.target.checked)}
                className="rounded border-[#3B4D3A] text-[#C9A227] focus:ring-[#D4AF37]"
              />
              <span>Motor Matching Numbers (Original de Fábrica)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#B4C4B6] cursor-pointer">
              <input
                type="checkbox"
                checked={hasFivaCert}
                onChange={(e) => setHasFivaCert(e.target.checked)}
                className="rounded border-[#3B4D3A] text-[#C9A227] focus:ring-[#D4AF37]"
              />
              <span>Certificado de Originalidade FIVA Ativo</span>
            </label>
          </div>

          {/* Valuation Result Display Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#263628] via-[#1A241C] to-[#121713] border border-[#D4AF37] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E5C158]" />
                Faixa Estimada de Mercado
              </span>
              <span className="text-[10px] text-[#A2B3A4] bg-[#121713] px-2 py-0.5 rounded-full border border-[#3B4D3A]">
                Índice Garage 95 2026
              </span>
            </div>

            <div className="text-center py-2">
              <p className="text-3xl sm:text-4xl font-serif-heading font-black text-[#F3E5AB]">
                R$ {estimatedValue.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-[#8EA290] mt-1 font-mono">
                Faixa sugerida: R$ {minRange.toLocaleString('pt-BR')} — R$ {maxRange.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#3B4D3A]/60 text-xs">
              <div className="bg-[#141C15]/80 p-3 rounded-xl border border-[#3B4D3A]/40">
                <p className="text-[10px] text-[#7E9180] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
                  Projeção em 5 Anos (+38%)
                </p>
                <p className="font-bold text-[#E8ECE8] text-sm mt-0.5">
                  R$ {appreciationProjection5Years.toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="bg-[#141C15]/80 p-3 rounded-xl border border-[#3B4D3A]/40">
                <p className="text-[10px] text-[#7E9180] flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-[#D4AF37]" />
                  Custo Médio de Manutenção
                </p>
                <p className="font-bold text-[#E8ECE8] text-sm mt-0.5">
                  ~R$ {estimatedRestorationCost.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
