# frozen_string_literal: true

require_relative '../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::Game do
  describe '#add_player' do
    let(:game) { described_class.new }
    let(:valid_player_id) { 'a2fc0b19dfea4c278379c8d9b79a4f6b' }

    it 'adds a player with a valid ID' do
      game.add_player(valid_player_id)
    end

    it 'requires the player ID to be a string' do
      expect do
        game.add_player(-1)
      end.to raise_error(ArgumentError, /player_id must be a string/)
    end

    it 'requires the player ID to be a 32-character hex string' do
      expect do
        game.add_player(' this is not a valid player id')
      end.to raise_error(ArgumentError, /player_id must be a 32 character hex string/)
    end

    it 'rejects duplicate player IDs' do
      game.add_player(valid_player_id)
      expect do
        game.add_player(valid_player_id)
      end.to raise_error(ArgumentError, /player_id already exists/)
    end
  end
end
