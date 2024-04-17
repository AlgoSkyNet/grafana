import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Button, Dropdown, Icon, LinkButton, Menu, Stack, Text, Tooltip, useStyles2 } from '@grafana/ui';
import { createUrl } from 'app/features/alerting/unified/utils/url';

import { SectionDto, SectionDtoStep, SectionsDto } from '../hooks/irmHooks';

import { ConfigurationTrackerDrawer } from './ConfigurationTrackerDrawer';
import { ProgressBar, StepsStatus } from './ProgressBar';

export interface EssentialsProps {
  onClose: () => void;
  essentialsConfig: SectionsDto;
  stepsDone: number;
  totalStepsToDo: number;
}

export function Essentials({ onClose, essentialsConfig, stepsDone, totalStepsToDo }: EssentialsProps) {
  return (
    <ConfigurationTrackerDrawer
      title="Essentials"
      subtitle="Complete basic recommended configuration to start using apps basic features"
      onClose={onClose}
    >
      <EssentialContent essentialContent={essentialsConfig} stepsDone={stepsDone} totalStepsToDo={totalStepsToDo} />
    </ConfigurationTrackerDrawer>
  );
}

function EssentialContent({
  essentialContent,
  stepsDone,
  totalStepsToDo,
}: {
  essentialContent: SectionsDto;
  stepsDone: number;
  totalStepsToDo: number;
}) {
  return (
    <Stack direction={'column'} gap={1}>
      <ProgressStatus stepsDone={stepsDone} totalStepsToDo={totalStepsToDo} />
      {essentialContent.sections.map((section: SectionDto) => (
        <Section key={section.title} section={section} />
      ))}
    </Stack>
  );
}

function Section({ section }: { section: SectionDto }) {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.wrapper}>
      <Text element="h4">{section.title}</Text>

      <Text color="secondary">{section.description}</Text>
      <Stack direction={'column'} gap={2}>
        {section.steps.map((step, index) => (
          <Step key={index} step={step} />
        ))}
      </Stack>
    </div>
  );
}
function DoneIcon({ done }: { done: boolean }) {
  return done ? <Icon name="check-circle" color="green" /> : <Icon name="circle" />;
}
interface StepProps {
  step: SectionDtoStep;
}

function Step({ step }: StepProps) {
  return (
    <Stack direction={'row'} justifyContent={'space-between'}>
      <Stack direction={'row'} alignItems="center">
        {step.button.done !== undefined && <DoneIcon done={step.button.done} />}
        <Text variant="body">{step.title}</Text>
        <Tooltip content={step.description} placement="right">
          <Icon name="question-circle" />
        </Tooltip>
      </Stack>
      {!step.button.done && <StepButton {...step.button} />}
    </Stack>
  );
}

interface StepButtonProps {
  type: 'openLink' | 'dropDown';
  url: string;
  label: string;
  options?: Array<{ label: string; value: string }>;
  done?: boolean;
}

function StepButton({ type, url, label, options }: StepButtonProps) {
  const urlToGo = createUrl(url, {
    returnTo: location.pathname + location.search,
  });
  function onIntegrationClick(integrationId: string) {
    const urlToGoWithIntegration = createUrl(url + integrationId, {
      returnTo: location.pathname + location.search,
    });
    locationService.push(urlToGoWithIntegration);
  }
  switch (type) {
    case 'openLink':
      return (
        <LinkButton href={urlToGo} variant="secondary">
          {label}
        </LinkButton>
      );
    case 'dropDown':
      return (
        <Dropdown
          overlay={
            <Menu>
              {options?.map((option) => (
                <Menu.Item label={option.label} onClick={() => onIntegrationClick(option.value)} key={option.label} />
              ))}
            </Menu>
          }
        >
          <Button variant="secondary" size="md">
            {label}
            <Icon name="angle-down" />
          </Button>
        </Dropdown>
      );
  }
}

function ProgressStatus({ stepsDone, totalStepsToDo }: { stepsDone: number; totalStepsToDo: number }) {
  return (
    <Stack direction={'row'} gap={1} alignItems="center">
      Your progress
      <ProgressBar stepsDone={stepsDone} totalStepsToDo={totalStepsToDo} />
      <StepsStatus stepsDone={stepsDone} totalStepsToDo={totalStepsToDo} />
    </Stack>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css({
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2),
      border: `1px solid ${theme.colors.border.medium}`,
      borderRadius: theme.shape.radius.default,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
    }),
  };
};
