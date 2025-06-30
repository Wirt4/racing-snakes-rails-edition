# frozen_string_literal: true

require_relative '../../app/lib/racing_snakes'

class DummyPlayer < RacingSnakes::AbstractPlayer
  def initialize(id)
    super(id)
    @id = id
  end
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

RSpec.describe RacingSnakes::Game do
  describe '#tick' do
    let(:game) { described_class.new }
    # NOTE: don't need to test for tick overflow or large number slowdown
    # racing snakes is a session-based game with an end case when competing players are eliminated
    # The grid should be nice and large, but with finite size
    # so in a worst case scenario, the game frames are limited by the number of tiles in the grid
    it 'increments the tick count' do
      initial_frame = game.frame_number
      game.tick
      expect(game.frame_number).to eq(initial_frame + 1)
    end

    it 'ensures that ticks are monotonically increasing' do
      initial_frame = game.frame_number
      game.tick
      expect(game.frame_number).to be > initial_frame
    end
  end
end
RSpec.describe RacingSnakes::Game do
  describe '#game_over?' do
    let(:game) { described_class.new }
    let(:mock_board) { instance_double(RacingSnakes::AbstractBoard, in_bounds?: true) }
    let(:player_one_id) { 'asdf8csig9dfea3n278379c8d99a4asa' }
    let(:player_two_id) { 'c2fc0b19dfea4c278379c8d9b79a4f6b' }
    it 'if all players are within board bounds, then game_over? is false' do
      game.add_player(player_one_id)
      game.add_player(player_two_id)
      expect(game.game_over?).to be false
    end
  end
end
