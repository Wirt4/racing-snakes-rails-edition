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
    let(:mock_player) { instance_double(RacingSnakes::AbstractPlayer, id: player_id, move: nil) }
    let(:mock_player_factory) do
      Class.new do
        def self.build(player_id)
          DummyPlayer.new(player_id)
        end
      end
    end
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil) }
    let(:game) { described_class.new(player_factory: mock_player_factory, player_roster: mock_roster) }
    it 'adds a player with a valid ID' do
      game.add_player(player_id)
    end
    it 'rejects duplicate player IDs' do
      game.add_player(player_id)
      expect do
        game.add_player(player_id)
      end.to raise_error(ArgumentError, /player_id already exists/)
    end
    it 'passes the player_id to the player roster' do
      game.add_player(player_id)
      expect(mock_roster).to have_received(:add_player).with(player_id)
    end
    it 'does not alter invariant: game.players is an array of AbstractPlayer' do
      game.add_player(player_id)
      expect(game.players).to all(be_a(RacingSnakes::AbstractPlayer))
    end
  end
end

RSpec.describe RacingSnakes::Game do
  describe '#tick' do
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil) }
    let(:game) { described_class.new(player_factory: mock_factory, player_roster: mock_roster) }
    let(:player_one_id) { '23fc0b19df235c278379c8d9b79a4fcr' }
    let(:player_two_id) { 'a2fc0b19dfea4c278379c8d9b79a4f6b' }
    let(:player_three_id) { 'lsoc0b19dfea4c278379c8d9b79ambis' }

    let(:mock_player_one) { instance_double(RacingSnakes::AbstractPlayer, id: player_one_id, move: nil, eliminated?: false) }
    let(:mock_player_two) { instance_double(RacingSnakes::AbstractPlayer, id: player_two_id, move: nil, eliminated?: false) }
    let(:mock_player_three) { instance_double(RacingSnakes::AbstractPlayer, id: player_two_id, move: nil, eliminated?: true) }
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil) }
    let(:mock_roster_factory) { instance_double(RacingSnakes::PlayerRosterFactory, build: mock_roster) }

    let(:mock_factory) do
      double('PlayerFactory').tap do |factory|
        allow(factory).to receive(:build) do |player_id|
          case player_id
          when player_one_id then mock_player_one
          when player_two_id then mock_player_two
          else mock_player_three
          end
        end
      end
    end
    # NOTE: don't need to test for tick overflow or large number slowdown
    # racing snakes is a session-based game with an end case when competing players are eliminated
    # The grid should be nice and large, but with finite size
    # so in a worst case scenario, the game frames are limited by the number of tiles in the grid
    it 'calls move on each non-elminated player' do
      game.add_player(player_one_id)
      game.add_player(player_two_id)
      game.add_player(player_three_id)

      game.tick

      expect(mock_player_one).to have_received(:move)
      expect(mock_player_two).to have_received(:move)
      expect(mock_player_three).not_to have_received(:move) # because player three is eliminated
    end
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
  describe '#waiting_for_players?' do
    let(:mock_player_factory) do
      Class.new do
        def self.build(player_id)
          DummyPlayer.new(player_id)
        end
      end
    end
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil) }
    let(:game) { described_class.new(player_factory: mock_player_factory, player_roster: mock_roster) }
    it 'returns true when no players are present' do
      expect(game.players).to be_empty
      expect(game.waiting_for_players?).to be true
    end
    it 'returns false when at least 2 players are present' do
      game.add_player('player1')
      game.add_player('player2')
      expect(game.players.size).to eq(2)
      expect(game.waiting_for_players?).to be false
    end
  end
end
RSpec.describe RacingSnakes::Game do
  describe '#game_over?' do
    let(:mock_player_factory) do
      Class.new do
        def self.build(player_id)
          DummyPlayer.new(player_id)
        end
      end
    end
    let(:mock_roster) { instance_double(RacingSnakes::AbstractPlayerRoster, add_player: nil) }
    let(:game) { described_class.new(player_factory: mock_player_factory, player_roster: mock_roster) }

    it 'its impossible for a game to be over while its still waiting for players' do
      game = described_class.new
      expect(game.game_over?).to be false
    end
    it 'if all but one player is eliminated, the game is over' do
      game.add_player('player1')
      game.add_player('player2')
      game.add_player('player3')
      game.players.each { |p| p.eliminated = true unless p.id == 'player1' }
      expect(game.game_over?).to be true
    end
  end
end
