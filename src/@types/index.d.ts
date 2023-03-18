export * from './config';
export { AppPage } from './app-page';
export { AppConfig } from './app-config';
export { LayoutConfig } from './form-panel';
export { FormScript } from './form-script';
export { PropertyGroup } from './property-group';
export { ComponentGroup } from './component-group';
export { ComponentOption } from './component-option';
export { ComponentProperty } from './component-property';
export { Component, ComponentAnswerType } from './component';
export { Questionnaire } from './questionnaire';
export { RemoteDevice } from './remote-device';
export { PropertyEditor } from './property-editor';
export { CreateNewConfig } from './create-new-config';
export { FormTimerConfig } from './form-timer-config';
export { FormDimensionConfig, FormDimensionItem } from './form-dimension-config';
export { ExportAppBody } from './export-app-body';
export { GeneralProperty } from './general-property';
export { RatingConfig } from './rating-config';
export { ComponentQuickTool } from './component-quick-tool';
export { ComponentRect } from './component-rect';

export type SetPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
