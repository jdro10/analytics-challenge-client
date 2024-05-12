export interface SimulationParametersRequest {
  assetClasses: { [key: string]: number };
  scenarioSpace: string;
  scenarioSpaceName: string;
}
