import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

const PRESETS = [
  { id: 'focus', label: 'Fokus', minutes: 25 },
  { id: 'short', label: 'Pushim i shkurtë', minutes: 5 },
  { id: 'long', label: 'Pushim i gjatë', minutes: 15 },
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export default function TimerScreen() {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  const BG = colors?.background ?? (isDark ? '#0B1220' : '#f5f5f5');
  const CARD = colors?.card ?? (isDark ? '#111827' : '#ffffff');
  const TEXT = colors?.text ?? (isDark ? '#F9FAFB' : '#1a1a1a');
  const MUTED = colors?.muted ?? (isDark ? '#9CA3AF' : '#666');
  const BORDER = colors?.border ?? (isDark ? '#374151' : '#e8e8e8');

  const [mode, setMode] = useState('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const initialSeconds = useMemo(() => {
    const p = PRESETS.find((x) => x.id === mode);
    return (p?.minutes ?? 25) * 60;
  }, [mode]);

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;

    setIsRunning(false);

    if (mode === 'focus') {
      setSessionsCompleted((x) => x + 1);

      setMode(() => {
        const nextSessionCount = sessionsCompleted + 1;
        return nextSessionCount % 4 === 0 ? 'long' : 'short';
      });

      return;
    }

    setMode('focus');
  }, [secondsLeft, mode, sessionsCompleted]);

  const currentPreset = PRESETS.find((x) => x.id === mode) ?? PRESETS[0];

  const handleToggle = () => setIsRunning((v) => !v);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  const handleSkip = () => {
    setIsRunning(false);

    if (mode === 'focus') {
      const nextSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(nextSessionCount);
      setMode(nextSessionCount % 4 === 0 ? 'long' : 'short');
    } else {
      setMode('focus');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: BG }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <Header
        backgroundColor="#e4ca47ff"
        title="Timer"
        subtitle="Pomodoro"
        icon="time-outline"
        showHome
        showBack={true}
        onBackPress={() => router.back()}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.container}>
          <View style={styles.presetRow}>
            {PRESETS.map((p) => {
              const active = p.id === mode;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setMode(p.id)}
                  style={[
                    styles.presetChip,
                    { backgroundColor: CARD, borderColor: BORDER },
                    active && styles.presetChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      { color: isDark ? '#D1D5DB' : '#444' },
                      active && styles.presetTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={[
              styles.timerCard,
              {
                backgroundColor: isDark ? (colors?.card ?? '#111827') : '#ffffffbb',
                borderColor: isDark ? BORDER : '#ffffffb9',
              },
            ]}
          >
            <Text style={[styles.modeTitle, { color: TEXT }]}>{currentPreset.label}</Text>

            <Text style={[styles.timeText, { color: TEXT }]}>{formatMMSS(secondsLeft)}</Text>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaBox,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f05b' },
                ]}
              >
                <Text style={[styles.metaLabel, { color: MUTED }]}>Sesione Fokusi</Text>
                <Text style={[styles.metaValue, { color: TEXT }]}>{sessionsCompleted}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttons}>
            <Button
              title={
                <Ionicons
                  name={isRunning ? 'pause' : 'play'}
                  size={20}
                  color= '#fff'
                />
              }
              onPress={handleToggle}
              style={styles.primaryBtn}
              textStyle={styles.primaryBtnText}
            />

            <View style={styles.secondaryRow}>
              <Button
                title={<Ionicons name="refresh" size={16} color= '#fff' />}
                onPress={handleReset}
                style={styles.secondaryBtn}
                textStyle={styles.secondaryBtnText}
              />

              <Button
                title={
                  <Ionicons
                    name="play-skip-forward"
                    size={16}
                    color='#fff'
                  />
                }
                onPress={handleSkip}
                style={styles.secondaryBtn}
                textStyle={styles.secondaryBtnText}
              />
            </View>
          </View>

          <View
            style={[
              styles.tipBox,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff4d',
                borderColor: isDark ? BORDER : '#edededa9',
              },
            ]}
          >
            <Text style={[styles.tipTitle, { color: isDark ? '#E5E7EB' : '#4a4a4a95' }]}>
              Rregulli
            </Text>
            <Text style={[styles.tipText, { color: isDark ? '#CBD5E1' : '#5d5d5db2' }]}>
              25 min fokus, 5 min pushim. {'\n'}
              Pas 4 sesioneve fokus, 15 min pushim i gjatë.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },

  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  presetChipActive: {
    borderColor: '#7e0a0aff',
  },
  presetText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#901d10ff',
  },

  timerCard: {
    backgroundColor: '#ffffffbb',
    borderRadius: 12,
    padding: 18,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#ffffffb9',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 54,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 18,
  },

  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBox: {
    flex: 1,
    backgroundColor: '#f0f0f05b',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '800',
  },

  buttons: {
    marginTop: 18,
    alignItems: 'center',
    width: '100%',
  },

  primaryBtn: {
    width: '90%',
    height: 50,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#981515ff',
    marginBottom: 12,
  },
  primaryBtnText: {
    fontWeight: '700',
    color: '#ffffffff',
  },

  secondaryRow: {
    width: '90%',
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#732020ff',
  },
  secondaryBtnText: {
    color: '#fff',
  },

  tipBox: {
    marginTop: 70,
    backgroundColor: '#ffffff4d',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edededa9',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a4a4a95',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: '#5d5d5db2',
    fontWeight: '500',
    lineHeight: 18,
  },
});
