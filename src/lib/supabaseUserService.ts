import { supabase } from './supabase';

export interface UserGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  background: string;
  goals: UserGoal[];
  interests: string[];
}

export class SupabaseUserService {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private getUserId(): string {
    if (!this.userId) {
      throw new Error('User ID not set. Please authenticate first.');
    }
    return this.userId;
  }

  // ============================================================================
  // USER PROFILE
  // ============================================================================

  async getProfile(): Promise<UserProfile> {
    const userId = this.getUserId();

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      // Profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({ id: userId })
        .select()
        .single();

      if (createError) throw createError;
      profile = newProfile;
    }

    // Get goals
    const { data: goals, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (goalsError) throw goalsError;

    // Get interests
    const { data: interests, error: interestsError } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (interestsError) throw interestsError;

    return {
      id: profile.id,
      background: profile.background || '',
      goals: goals.map(g => ({
        id: g.id,
        text: g.text,
        completed: g.completed,
      })),
      interests: interests.map(i => i.interest),
    };
  }

  async updateBackground(background: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ background })
      .eq('id', this.getUserId());

    if (error) throw error;
  }

  // ============================================================================
  // GOALS
  // ============================================================================

  async addGoal(text: string): Promise<UserGoal> {
    const { data, error } = await supabase
      .from('user_goals')
      .insert({
        user_id: this.getUserId(),
        text,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      text: data.text,
      completed: data.completed,
    };
  }

  async updateGoal(goalId: string, updates: { text?: string; completed?: boolean }): Promise<void> {
    const { error } = await supabase
      .from('user_goals')
      .update(updates)
      .eq('id', goalId)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  // ============================================================================
  // INTERESTS
  // ============================================================================

  async addInterest(interest: string): Promise<void> {
    const { error } = await supabase
      .from('user_interests')
      .insert({
        user_id: this.getUserId(),
        interest,
      });

    if (error) {
      // Ignore duplicate key errors
      if (!error.message.includes('duplicate')) {
        throw error;
      }
    }
  }

  async removeInterest(interest: string): Promise<void> {
    const { error } = await supabase
      .from('user_interests')
      .delete()
      .eq('user_id', this.getUserId())
      .eq('interest', interest);

    if (error) throw error;
  }

  async setInterests(interests: string[]): Promise<void> {
    // Delete all existing interests
    const { error: deleteError } = await supabase
      .from('user_interests')
      .delete()
      .eq('user_id', this.getUserId());

    if (deleteError) throw deleteError;

    // Insert new interests
    if (interests.length > 0) {
      const { error: insertError } = await supabase
        .from('user_interests')
        .insert(
          interests.map(interest => ({
            user_id: this.getUserId(),
            interest,
          }))
        );

      if (insertError) throw insertError;
    }
  }
}

// Export singleton instance
export const userService = new SupabaseUserService();
