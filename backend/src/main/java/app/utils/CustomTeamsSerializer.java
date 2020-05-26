package app.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import app.models.Team;

public class CustomTeamsSerializer extends StdSerializer<List<Team>> {

    private static final long serialVersionUID = 1L;

    public CustomTeamsSerializer() {
        this(null);
    }

    public CustomTeamsSerializer(Class<List<Team>> t) {
        super(t);
    }

    @Override
    public void serialize(List<Team> teams, JsonGenerator generator, SerializerProvider provider)
            throws IOException, JsonProcessingException {

        List<Team> teamsDTO = new ArrayList<>();
        for (Team team : teams) {
            team.setBoards(new ArrayList<>());
            teamsDTO.add(team);
        }
        generator.writeObject(teamsDTO);
    }
}