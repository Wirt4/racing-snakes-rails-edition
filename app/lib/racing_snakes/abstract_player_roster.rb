# frozen_string_literal: true

module RacingSnakes
  # Abstract class for player roster management
  # Players can be added, removed, and have their functions called en masse.
  # Invariants:
  # - All participating players have a unique player_id
  class AbstractPlayerRoster
    def deactivate(crashed_players: Array[String])
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def active_players
      # NOTE: return type is a count of active players
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def count
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def state
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def add_player(player_id)
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def move_players
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end
  end
end
