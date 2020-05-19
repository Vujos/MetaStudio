package app.models;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CustomUsersSerializer extends StdSerializer<List<User>> {

    private static final long serialVersionUID = 1L;

    public CustomUsersSerializer() {
        this(null);
     }
  
    public CustomUsersSerializer(Class<List<User>> t) {
        super(t);
    }

    @Override
    public void serialize(
    List<User> users, 
    JsonGenerator generator, 
    SerializerProvider provider) 
    throws IOException, JsonProcessingException {
        
        List<User> usersDTO = new ArrayList<>();
        for (User user : users) {
            user.setBoards(new ArrayList<>());
            usersDTO.add(user);
        }
        generator.writeObject(usersDTO);
    }
 }