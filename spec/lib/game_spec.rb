# frozen_string_literal: true

require_relative '../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::Game do
  describe '#add_player' do
    let(:game) { described_class.new }
    it 'game has an add_player method' do
      game.add_player('a2fc0b19dfea4c278379c8d9b79a4f6b')
    end
    it 'the player id must be a string' do
      expect do
        game.add_player(-1)
      end.to raise_error(ArgumentError, /player_id must be a string/)
    end

    it 'the player id must be a 32 char hex generated' do
      expect do
        game.add_player(' this is not a valid player id')
      end.to raise_error(ArgumentError, /player_id must be a 32 char hex string/)
    end
  end
end
