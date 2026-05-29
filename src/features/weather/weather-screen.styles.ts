import { StyleSheet } from 'react-native';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export const weatherScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  pageHeader: {
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  headerTitleGroup: {
    gap: Spacing.half,
  },
  appTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  appSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  heroCard: {
    borderRadius: 32,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
  heroSymbol: {
    fontSize: 54,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: Spacing.one,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  temperatureRow: {
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  temperatureValue: {
    fontSize: 88,
    lineHeight: 90,
    fontWeight: '700',
  },
  temperatureMeta: {
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: Spacing.four,
    alignSelf: 'flex-start',
  },
  card: {
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  warningCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  warningTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 150,
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  detailsCard: {
    borderRadius: 28,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    alignItems: 'center',
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  suggestionButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastSuggestionButton: {
    borderBottomWidth: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    alignItems: 'center',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: Spacing.one,
  },
  primaryButtonLabel: {
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: Spacing.one,
  },
  secondaryButtonLabel: {
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },
});
