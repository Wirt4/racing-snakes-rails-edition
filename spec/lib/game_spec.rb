# frozen_string_literal: true

require_relative '../../app/lib/racing_snakes'

class DummyPlayer < RacingSnakes::AbstractPlayer
  def initialize(id) = @id = id
  attr_reader :id
end

RSpec.describe RacingSnakes::Game do
  describe '#add_player' do
    let(:player_id) { 'a2fc0b19dfea4c278379c8d9b79a4f6b' }

    let(:mock_player) { instance_double(RacingSnakes::AbstractPlayer, id: player_id) }

    let(:mock_factory) do
      Class.new do
        def self.build(player_id)
          DummyPlayer.new(player_id)
        end
      end
    end

    let(:game) { described_class.new(player_factory: mock_factory) }
    it 'adds a player with a valid ID' do
      game.add_player(player_id)
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
      game.add_player(player_id)
      expect do
        game.add_player(player_id)
      end.to raise_error(ArgumentError, /player_id already exists/)
    end
    it 'does not alter invariant: game.players is an array of AbstractPlayer' do
      game.add_player(player_id)
      expect(game.players).to all(be_a(RacingSnakes::AbstractPlayer))
    end
  end
end
