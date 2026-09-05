import React from 'react';
import { VisualType } from '../../types';
import { CircuitSimulator } from './visuals/CircuitSimulator';
import { PhysicsSimulator } from './visuals/PhysicsSimulator';
import { MathVisualizer } from './visuals/MathVisualizer';
import { BiologyDiagram } from './visuals/BiologyDiagram';
import { CodeRunnerVisual } from './visuals/CodeRunnerVisual';
import { ChemistryVisual } from './visuals/ChemistryVisual';
import { HistoryTimelineVisual } from './visuals/HistoryTimelineVisual';
import { ApiWorkflowVisual } from './visuals/ApiWorkflowVisual';
import { WaterPipeAnalogy } from './visuals/WaterPipeAnalogy';
import { ConceptCardVisual } from './visuals/ConceptCardVisual';

interface TeachingVisualProps {
  type: VisualType;
  data: any;
  className?: string;
  onSimulationChange?: (v: number, r: number, i: number) => void;
}

export const TeachingVisual: React.FC<TeachingVisualProps> = ({
  type,
  data = {},
  className = '',
  onSimulationChange
}) => {
  const d: any = data || {};

  switch (type) {
    case 'circuit_simulation':
      return (
        <CircuitSimulator
          initialVoltage={d.initialVoltage || 12}
          initialResistance={d.initialResistance || 20}
          onValuesChange={onSimulationChange}
        />
      );

    case 'physics_simulation':
      return (
        <PhysicsSimulator
          initialMass={d.mass || 5}
          initialForce={d.appliedForce || 25}
          forces={d.forces}
          concept={d.concept || "Newtonian Mechanics & Force Equilibrium"}
          className={className}
        />
      );

    case 'math_equation':
      return (
        <MathVisualizer
          equation={d.equation}
          title={d.title}
          steps={d.steps}
          className={className}
        />
      );

    case 'biology_diagram':
      return (
        <BiologyDiagram
          title={d.title}
          diagramType={d.diagramType}
          keyStructures={d.keyStructures}
          equation={d.equation}
          className={className}
        />
      );

    case 'code_runner':
      return (
        <CodeRunnerVisual
          language={d.language || "python"}
          title={d.title}
          code={d.code}
          executionSteps={d.executionSteps}
          consoleOutput={d.consoleOutput}
          className={className}
        />
      );

    case 'api_workflow':
    case 'architecture_diagram':
      return (
        <ApiWorkflowVisual
          title={d.title || "Postman & API Architecture Workflow"}
          method={d.method || "GET"}
          endpoint={d.endpoint}
          headers={d.headers}
          requestBody={d.requestBody}
          statusCode={d.statusCode}
          statusText={d.statusText}
          responseBody={d.responseBody}
          workflowSteps={d.workflowSteps}
          className={className}
        />
      );

    case 'chemistry_visual':
      return (
        <ChemistryVisual
          title={d.title}
          reactants={d.reactants}
          products={d.products}
          enthalpy={d.enthalpy}
          bonding={d.bonding}
          molecules={d.molecules}
          className={className}
        />
      );

    case 'timeline':
      return (
        <HistoryTimelineVisual
          title={d.title}
          events={d.events}
          className={className}
        />
      );

    case 'water_pipe_analogy':
      return (
        <WaterPipeAnalogy
          pipeTightness={d.pipeTightness || 4}
          pumpPressure={d.pumpPressure || 3}
        />
      );

    case 'concept_card':
    default:
      return (
        <ConceptCardVisual
          title={d.title || "Foundational Principles"}
          formula={d.formula}
          unit={d.unit}
          points={d.points || []}
          batteryVoltage={d.batteryVoltage}
        />
      );
  }
};
