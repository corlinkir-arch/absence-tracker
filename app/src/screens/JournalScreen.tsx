import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { colors, spacing, typography } from '../theme';
import { JournalEntry } from '../types/journal';
import { clearJournalEntries, getJournalEntries, saveJournalEntry } from '../services/storage/journalStorage';

export function JournalScreen() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [reflection, setReflection] = useState('');
  const [reflectionError, setReflectionError] = useState('');
  const [mood, setMood] = useState('Calm');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      const storedEntries = await getJournalEntries();
      setEntries(storedEntries);
    };

    loadEntries();
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;
    setTitleError('');
    setReflectionError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters');
      isValid = false;
    }

    if (!reflection.trim()) {
      setReflectionError('Reflection is required');
      isValid = false;
    } else if (reflection.trim().length < 10) {
      setReflectionError('Reflection must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaveLoading(true);
    try {
      const entry: JournalEntry = {
        id: `${Date.now()}`,
        title: title.trim(),
        reflection: reflection.trim(),
        mood,
        createdAt: new Date().toISOString(),
      };

      await saveJournalEntry(entry);
      setEntries((current) => [entry, ...current]);
      setTitle('');
      setReflection('');
      setMood('Calm');
      setVisible(false);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleClear = async () => {
    await clearJournalEntries();
    setEntries([]);
  };

  const getMoodVariant = (moodText: string): 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (moodText.toLowerCase()) {
      case 'calm':
        return 'accent';
      case 'happy':
        return 'success';
      case 'sad':
        return 'error';
      case 'anxious':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="Memory Journal" subtitle="Capture the quiet moments that matter." />
      <SectionHeader title="Entries" hint="Keep a living record of your reflections." />
      
      <Card style={styles.card}>
        <Text style={styles.title}>Your memories will appear here.</Text>
        <Text style={styles.body}>Start adding reflections, photos, voice notes, and daily moods.</Text>
        <View style={styles.actions}>
          <Button title="New Memory" onPress={() => setVisible(true)} fullWidth />
          {entries.length > 0 && (
            <Button title="Clear All" variant="danger" onPress={handleClear} fullWidth />
          )}
        </View>
      </Card>

      {entries.length === 0 ? (
        <View style={styles.state}>
          <EmptyState title="No entries yet" hint="This space will grow into a personal archive." />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {entries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Badge label={entry.mood} variant={getMoodVariant(entry.mood)} size="sm" />
              </View>
              <Text style={styles.entryReflection}>{entry.reflection}</Text>
              <Text style={styles.entryDate}>{new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Text>
            </Card>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={visible}
        title="New memory"
        subtitle="Capture this moment with a reflection"
        onClose={() => setVisible(false)}
        size="lg"
        footer={
          <View style={styles.modalFooter}>
            <Button title="Cancel" variant="secondary" onPress={() => setVisible(false)} fullWidth />
            <Button title="Save Memory" onPress={handleSave} loading={saveLoading} fullWidth />
          </View>
        }
      >
        <Input
          label="Title"
          placeholder="What happened today?"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setTitleError('');
          }}
          error={titleError}
          helperText="Give your memory a meaningful title"
        />
        <Input
          label="Reflection"
          placeholder="Write a few gentle lines about this moment..."
          value={reflection}
          onChangeText={(text) => {
            setReflection(text);
            setReflectionError('');
          }}
          error={reflectionError}
          multiline
          maxLength={500}
          showCharCount
          helperText="Share your thoughts and feelings"
        />
        <Input
          label="How are you feeling?"
          placeholder="e.g., Calm, Happy, Sad, Anxious"
          value={mood}
          onChangeText={setMood}
          helperText="Describe your emotional state"
        />
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0 },
  card: { marginTop: spacing.md },
  title: { color: colors.textPrimary, fontSize: typography.subtitle, fontWeight: '600', marginBottom: spacing.sm },
  body: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 20, marginBottom: spacing.md },
  actions: { marginTop: spacing.md, flexDirection: 'column', gap: spacing.sm },
  state: { marginTop: spacing.lg, flex: 1 },
  list: { marginTop: spacing.md, flex: 1 },
  listContent: { paddingBottom: spacing.xl },
  entryCard: { marginBottom: spacing.md },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  entryTitle: { color: colors.textPrimary, fontSize: typography.body + 1, fontWeight: '700', flex: 1 },
  entryReflection: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 20, marginBottom: spacing.sm },
  entryDate: { color: colors.textTertiary, fontSize: typography.micro, fontWeight: '500' },
  modalFooter: { flexDirection: 'column', gap: spacing.md },
});
