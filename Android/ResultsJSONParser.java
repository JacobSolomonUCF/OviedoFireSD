package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by David on 10/10/2017.
 */

public class ResultsJSONParser {
    public static void resultsParse(String str, TextView mTitleTextView, TextView mCBTextView, TextView mDateCBTextView, TableLayout mTableLayout, Context context){
        try {
            JSONObject object = (JSONObject) new JSONObject(str);
            String formTitle=object.optString("title");
            System.out.println("formTitle is "+formTitle);
            String completedBy=object.optString("completedBy");
            mCBTextView.setText("Completed by "+completedBy);
            mCBTextView.setTextColor(Color.BLACK);
            String dateCompleted=object.optString("datestamp");
            mDateCBTextView.setText(" on "+dateCompleted);
            mDateCBTextView.setTextColor(Color.BLACK);
            if (formTitle!=null&&!formTitle.isEmpty()) {
                mTitleTextView.setText(formTitle);
                System.out.println("The form title was successfully set to "+formTitle);
            }
            else
                System.out.println("Uhoh, formTitle was null or empty?");
            //handle subsections
            JSONArray jsonArray = object.optJSONArray("results");
            for (int a=0; a<jsonArray.length(); a++){
                JSONObject subObject = jsonArray.optJSONObject(a);
                if (subObject.isNull("results")){
                    subElementsParse(subObject, mTableLayout, context);
                }
                else{
                    System.out.println("Subsection "+a);
                    JSONArray jsonSubArray = subObject.optJSONArray("results");
                    TableRow sTableRow = new TableRow(context);
                    mTableLayout.addView(sTableRow);
                    sTableRow.setBackgroundColor(Color.LTGRAY);
                    TextView sTextView = new TextView(context);
                    sTableRow.addView(sTextView);
                    sTextView.setTextColor(Color.BLACK);
                    String subTitle=subObject.optString("title");
                    sTextView.setText(subTitle);
                    //// TODO: make section title large and/or bold and/or underlined
                    sTableRow.setTag("subSection");
                    //go deeper
                    for (int s=0; s<jsonSubArray.length(); s++){
                        JSONObject itemObject = jsonSubArray.optJSONObject(s);
                        subElementsParse(itemObject, mTableLayout, context);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    static void subElementsParse(JSONObject jObject, TableLayout mTableLayout, Context context) {
        TableRow tableRow = new TableRow(context);
        tableRow.setDividerDrawable(ContextCompat.getDrawable(context, R.drawable.rectdivider));
        tableRow.setShowDividers(TableRow.SHOW_DIVIDER_MIDDLE);
        mTableLayout.addView(tableRow);
        //caption
        TextView captionView = new TextView(context);
        String caption = jObject.optString("caption");
        captionView.setText(caption);
        captionView.setGravity(1);
        captionView.setTextColor(Color.BLACK);
        captionView.setTag("caption");
        captionView.setPadding(20,10,20,0);
        tableRow.addView(captionView);
        //result
        TextView resultView = new TextView(context);
        String result = jObject.optString("result");
        resultView.setText(result);
        resultView.setGravity(1);
        resultView.setPadding(20,10,20,0);
        resultView.setTextColor(Color.BLACK);
        if (result.equals("Needs repair")||result.equals("Repairs Needed")){
            resultView.setTextColor(Color.RED);
            TextView repairRow = new TextView(context);
            repairRow.setPadding(10,0,10,0);
            mTableLayout.addView(repairRow);
            repairRow.setText("NOTE: "+jObject.optString("note"));
            repairRow.setTextColor(Color.RED);

        }
        else if (result.equals("Missing")||result.equals("Failed")||result.equals("0%")||result.equals("0"))
            resultView.setTextColor(Color.RED);
        tableRow.addView(resultView);
        //type
        String type = jObject.optString("type");
        tableRow.setTag(type);
    }
}
