import { css } from '@emotion/css';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, Card, Icon, IconName, Stack, useStyles2 } from '@grafana/ui';
import { AlertmanagerProvider } from 'app/features/alerting/unified/state/AlertmanagerContext';
import { fetchAllPromBuildInfoAction } from 'app/features/alerting/unified/state/actions';
import {
  GRAFANA_RULES_SOURCE_NAME,
  getFirstCompatibleDataSource,
} from 'app/features/alerting/unified/utils/datasource';
import { DATASOURCES_ROUTES } from 'app/features/datasources/constants';
import { useDispatch } from 'app/types';

import { useGetEssentialsConfiguration } from '../hooks/irmHooks';

import { Essentials } from './Essentials';
import { ProgressBar, StepsStatus } from './ProgressBar';
interface DataConfiguration {
  id: number;
  title: string;
  description: string;
  text: string;
  actionButtonTitle: string;
  isDone?: boolean;
  stepsDone?: number;
  totalStepsToDo?: number;
  titleIcon?: IconName;
}

export function ConfigureIRM() {
  const styles = useStyles2(getStyles);
  const history = useHistory();
  const dispatchReduxAction = useDispatch();
  useEffect(() => {
    dispatchReduxAction(fetchAllPromBuildInfoAction());
  }, [dispatchReduxAction]);
  const dataSourceCompatibleWithAlerting = Boolean(getFirstCompatibleDataSource()); // we need at least one datasource compatible with alerting

  const [essentialsOpen, setEssentialsOpen] = useState(false);
  const { essentialContent, stepsDone, totalStepsToDo } = useGetEssentialsConfiguration();
  const configuration: DataConfiguration[] = useMemo(() => {
    return [
      {
        id: 1,
        title: 'Connect data source(s) to receive data',
        description: 'Before your start configuration you need to connect at least one datasource.',
        text: 'Configure IRM',
        actionButtonTitle: 'Connect',
        isDone: dataSourceCompatibleWithAlerting,
      },
      {
        id: 2,
        title: 'Essentials',
        titleIcon: 'star',
        description: 'Configure the features you need to start using Grafana IRM workflows',
        text: 'Configure IRM',
        actionButtonTitle: 'Start',
        stepsDone: stepsDone,
        totalStepsToDo: totalStepsToDo,
      },
    ];
  }, [dataSourceCompatibleWithAlerting, stepsDone, totalStepsToDo]);

  const handleActionClick = (configID: number) => {
    switch (configID) {
      case 1:
        history.push(DATASOURCES_ROUTES.New);
        break;
      case 2:
        setEssentialsOpen(true);
        break;
      default:
        return;
    }
  };

  return (
    <section className={styles.container}>
      {configuration.map((config) => {
        return (
          <Card key={config.id}>
            <Card.Heading className={styles.title}>
              <div className={styles.essentialsTitle}>
                <Stack direction={'row'} gap={1}>
                  {config.title}
                  {config.titleIcon && <Icon name={config.titleIcon} />}
                  {config.isDone && <Icon name="check-circle" color="green" size="lg" />}
                </Stack>
                {config.stepsDone && config.totalStepsToDo && (
                  <Stack direction="row" gap={1}>
                    <StepsStatus stepsDone={config.stepsDone} totalStepsToDo={config.totalStepsToDo} />
                    complete
                  </Stack>
                )}
              </div>
            </Card.Heading>
            {!config.isDone && (
              <>
                <Card.Description className={styles.description}>
                  <Stack direction={'column'}>
                    {config.description}
                    {config.stepsDone && config.totalStepsToDo && (
                      <ProgressBar stepsDone={config.stepsDone} totalStepsToDo={config.totalStepsToDo} />
                    )}
                  </Stack>
                </Card.Description>
                <Card.Actions>
                  <Button variant="secondary" onClick={() => handleActionClick(config.id)}>
                    {config.actionButtonTitle}
                  </Button>
                </Card.Actions>
              </>
            )}
          </Card>
        );
      })}
      {essentialsOpen && (
        <AlertmanagerProvider accessType={'notification'} alertmanagerSourceName={GRAFANA_RULES_SOURCE_NAME}>
          <Essentials
            onClose={() => setEssentialsOpen(false)}
            essentialsConfig={essentialContent}
            stepsDone={stepsDone}
            totalStepsToDo={totalStepsToDo}
          />
        </AlertmanagerProvider>
      )}
    </section>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    marginBottom: 0,
    display: 'grid',
    gap: theme.spacing(3),
    'grid-template-columns': ' 1fr 1fr',
  }),
  title: css({
    'justify-content': 'flex-start',
    alignItems: 'baseline',
    gap: theme.spacing(0.5),
  }),
  description: css({
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    overflow: 'hidden',
  }),
  essentialsTitle: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }),
});
